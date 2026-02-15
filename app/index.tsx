import { useEffect, useState } from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import { HistoricItemsData } from "./types";
import * as Device from "expo-device";

import * as Location from "expo-location";
import LocationInfo from "./locationInfo";
import { AllGeoJSON } from "@turf/helpers";

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState<boolean>(false);

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

    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 10,
      },
      (newLocation) => {
        if (newLocation?.coords?.longitude && newLocation?.coords?.latitude) {
          setLocationTracking(true);
          const historicInfo: HistoricItemsData = LocationInfo(
            newLocation!.coords.longitude,
            newLocation!.coords.latitude,
          );
          console.log(historicInfo);
        }
      },
    );
  }
  useEffect(() => {
    startLocationTracking();
    // Cleanup function to stop location tracking when component unmounts
    return () => {
      setLocationTracking(false);
      console.log("Locatie wordt niet meer gevolgd");
    };
  }, []);

  return (
    <View style={styles.container}>
      {/*<OpenURLButton url={urlHistorischObject}>
        {naamHistorischObject}*/}
      {/*</OpenURLButton>
      <Text />*/}
      <Text>Het werkt</Text>
      {/*<HistoricItem {}></HistoricItem>*/}
      {/*<Text style={styles.paragraph}>Locatie: {text}</Text>*/}
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
