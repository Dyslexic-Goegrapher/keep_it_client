import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { colors } from "@/themes/colors";

import HistoricInfoDisplay from "@/features/historic/components/HistoricInfoDisplay";
import useHistoricDataFetcher from "@/features/historic/hooks/useHistoricDataFetcher";
import { watchForegroundLocation } from "@/lib/geospatial/watchForegroundLocation";
import { watchRotation } from "@/lib/geospatial/watchRotation";

export default function HistoricScreen() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState(false);
  const [rotationData, setRotationData] = useState<number | null>(null);

  const { historicDataFetcher, fetchHistoricData } = useHistoricDataFetcher();

  useEffect(() => {
    let isActive = true;
    let subscription: Awaited<ReturnType<typeof watchForegroundLocation>> =
      null;

    const start = async () => {
      const nextSubscription = await watchForegroundLocation({
        onLocation: ({ longitude, latitude, heading }) => {
          setErrorMsg(null);
          setLocationTracking(true);
          void fetchHistoricData(longitude, latitude, 1);
          console.log(longitude, latitude, heading);
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
    let subscription: Awaited<ReturnType<typeof watchRotation>> = null;

    const start = async () => {
      const nextSubscription = await watchRotation({
        onRotation: (rotation) => {
          setErrorMsg(null);
          setRotationData(rotation.alpha);
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
        <Text>
          {rotationData ? `alpha: ${rotationData}` : "Waiting for rotation..."}
        </Text>
        {historicDataFetcher.data.features?.map((item) => (
          <HistoricInfoDisplay
            key={item.properties.uri}
            historicData={item.properties}
            errorMsg={errorMsg}
            locationSet={locationSet}
          />
        ))}
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
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
});
