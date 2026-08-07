import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DeviceMotion } from "expo-sensors";
import { useEffect, useState } from "react";

import { colors } from "@/themes/colors";

import HistoricInfoDisplay from "@/features/historic/components/HistoricInfoDisplay";
import useHistoricDataFetcher from "@/features/historic/hooks/useHistoricDataFetcher";
import { watchForegroundLocation } from "@/lib/geospatial/watchForegroundLocation";

function ZAxisRotationDisplay() {
  const [zRotationDegrees, setZRotationDegrees] = useState<number | null>(null);
  const [sensorError, setSensorError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    let subscription: ReturnType<typeof DeviceMotion.addListener> | null = null;

    const start = async () => {
      const isAvailable = await DeviceMotion.isAvailableAsync();

      if (!isActive) {
        return;
      }

      if (!isAvailable) {
        setSensorError("Device motion sensor is not available on this device.");
        return;
      }

      DeviceMotion.setUpdateInterval(250);
      subscription = DeviceMotion.addListener(({ rotation }) => {
        setSensorError(null);
        setZRotationDegrees((rotation.alpha * 180) / Math.PI);
      });
    };

    void start();

    return () => {
      isActive = false;
      subscription?.remove();
    };
  }, []);

  return (
    <View style={styles.sensorContainer}>
      <Text style={styles.sensorLabel}>Z-axis rotation</Text>
      <Text style={styles.sensorValue}>
        {sensorError ??
          (zRotationDegrees === null
            ? "Waiting for sensor..."
            : `${zRotationDegrees.toFixed(2)}°`)}
      </Text>
    </View>
  );
}

export default function HistoricScreen() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState(false);

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
  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView
        style={styles.infoContainer}
        contentContainerStyle={styles.infoContent}
        showsVerticalScrollIndicator={false}
      >
        <ZAxisRotationDisplay />
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
  sensorContainer: {
    width: "90%",
    padding: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.grey100,
  },
  sensorLabel: {
    color: colors.grey700,
    fontSize: 14,
  },
  sensorValue: {
    marginTop: 4,
    color: colors.grey900,
    fontSize: 20,
    fontWeight: "600",
  },
});
