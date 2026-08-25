import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useMemo, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { bearing } from "@turf/bearing";
import { point } from "@turf/helpers";

import { colors } from "@/themes/colors";
import { spacing } from "@/themes/spacing";

import HistoricInfoDisplay from "@/features/historic/components/HistoricInfoDisplay";
import useHistoricDataFetcher from "@/features/historic/hooks/useHistoricDataFetcher";
import { watchForegroundLocation } from "@/lib/geospatial/watchForegroundLocation";
import { watchHeading } from "@/lib/geospatial/watchHeading";

type UserLocation = {
  longitude: number;
  latitude: number;
};

const compassSize = 280;
const compassRadius = 110;
const markerWidth = 140;
const markerHeight = 64;

function normalizeAngle(angle: number) {
  return ((angle + 540) % 360) - 180;
}

function getMarkerPosition(relativeAngle: number) {
  const radians = (relativeAngle * Math.PI) / 180;
  const x = Math.sin(radians) * compassRadius;
  const y = -Math.cos(radians) * compassRadius;

  return {
    left: compassSize / 2 + x - markerWidth / 2,
    top: compassSize / 2 + y - markerHeight / 2,
  };
}

function markersOverlap(
  first: { left: number; top: number },
  second: { left: number; top: number },
) {
  return (
    first.left < second.left + markerWidth &&
    first.left + markerWidth > second.left &&
    first.top < second.top + markerHeight &&
    first.top + markerHeight > second.top
  );
}

export default function HistoricScreen() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const { historicDataFetcher, fetchHistoricData } = useHistoricDataFetcher();

  const historicItemsWithRelativeAngle = useMemo(() => {
    if (!userLocation) {
      return [];
    }

    const userPoint = point([userLocation.longitude, userLocation.latitude]);

    return (historicDataFetcher.data.features ?? []).map((item) => ({
      ...item,
      relativeAngle:
        heading === null
          ? null
          : normalizeAngle(bearing(userPoint, item) - heading),
    }));
  }, [heading, historicDataFetcher.data.features, userLocation]);

  const visibleHistoricItems = useMemo(() => {
    return historicItemsWithRelativeAngle.reduce<
      ((typeof historicItemsWithRelativeAngle)[number] & {
        markerPosition: { left: number; top: number };
      })[]
    >((visibleItems, item) => {
      if (item.relativeAngle === null) {
        return visibleItems;
      }

      const markerPosition = getMarkerPosition(item.relativeAngle);
      const overlapsExistingItem = visibleItems.some((visibleItem) =>
        markersOverlap(visibleItem.markerPosition, markerPosition),
      );

      if (overlapsExistingItem) {
        return visibleItems;
      }

      visibleItems.push({
        ...item,
        markerPosition,
      });

      return visibleItems;
    }, []);
  }, [historicItemsWithRelativeAngle]);

  useEffect(() => {
    let isActive = true;
    let subscription: Awaited<ReturnType<typeof watchForegroundLocation>> =
      null;

    const start = async () => {
      const nextSubscription = await watchForegroundLocation({
        onLocation: ({ longitude, latitude }) => {
          setErrorMsg(null);
          setLocationTracking(true);
          setUserLocation({ longitude, latitude });
          void fetchHistoricData(longitude, latitude, 3);
        },
        onError: setErrorMsg,
      });

      if (!isActive) {
        nextSubscription?.remove();
        return;
      }

      subscription = nextSubscription;
    };

    void start();

    return () => {
      isActive = false;
      subscription?.remove();
      setLocationTracking(false);
    };
  }, [fetchHistoricData]);

  useEffect(() => {
    let isActive = true;
    let subscription: Awaited<ReturnType<typeof watchHeading>> = null;

    const start = async () => {
      const nextSubscription = await watchHeading({
        onHeading: (nextHeading) => {
          setErrorMsg(null);
          setHeading(nextHeading);
        },
        onError: setErrorMsg,
      });

      if (!isActive) {
        nextSubscription?.remove();
        return;
      }

      subscription = nextSubscription;
    };

    void start();

    return () => {
      isActive = false;
      subscription?.remove();
    };
  }, []);
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView
        style={styles.infoContainer}
        contentContainerStyle={styles.infoContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.compassContainer}>
          <View style={styles.compassCircle}>
            <View style={styles.centerMarker}>
              <Ionicons
                name="locate"
                size={28}
                color={colors.grey950}
                accessibilityLabel="Current location"
              />
            </View>
            {visibleHistoricItems.map((item) => (
              <View
                key={item.properties.uri}
                style={[styles.marker, item.markerPosition]}
              >
                <HistoricInfoDisplay
                  historicData={item.properties}
                  relativeAngle={item.relativeAngle}
                  errorMsg={errorMsg}
                  locationSet={locationSet}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: colors.grey50,
  },
  infoContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  compassContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  compassCircle: {
    width: compassSize,
    height: compassSize,
    borderRadius: compassSize / 2,
    borderWidth: 2,
    borderColor: colors.grey300,
    backgroundColor: colors.grey100,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centerMarker: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  centerMarkerText: {
    color: colors.grey50,
    fontWeight: "600",
  },
  marker: {
    position: "absolute",
    width: markerWidth,
    minHeight: markerHeight,
    marginLeft: 0,
  },
});
