import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { HistoricData } from "./types";
import * as Device from "expo-device";

import * as Location from "expo-location";
import { LocationInfo } from "./historicDataRetrieval";
import HistoricItem from "./historisch_object";

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState<boolean>(false);
  const [historicInfo, setHistoricInfo] = useState<HistoricData | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startLocationTracking() {
      if (Platform.OS === "android" && !Device.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android Emulator. Try it on your device!",
        );
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Toegang tot locatie werd geweigerd");
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          if (newLocation?.coords?.longitude && newLocation?.coords?.latitude) {
            setLocationTracking(true);
            const info: HistoricData = LocationInfo(
              newLocation.coords.longitude,
              newLocation.coords.latitude,
            );
            setHistoricInfo(info);
          }
        },
      );
    }

    startLocationTracking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
      setLocationTracking(false);
      console.log("Locatie wordt niet meer gevolgd");
    };
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>{errorMsg}</Text>
      </View>
    );
  }

  if (!historicInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>Locatie wordt opgehaald...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HistoricItem historicData={historicInfo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#666",
    marginBottom: 10,
  },
});
