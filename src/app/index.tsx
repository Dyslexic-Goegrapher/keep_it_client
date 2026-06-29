import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Platform } from "react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";

import useHistoricData from "./useHistoricData";
import HistoricInfoDisplay from "./HistoricInfoDisplay";

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState<boolean>(false);

  const { historicData, fetchHistoricData } = useHistoricData();

  const startLocationTracking = useCallback(async () => {
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
          fetchHistoricData(
            newLocation.coords.longitude.toFixed(6),
            newLocation.coords.latitude.toFixed(6),
          );
        }
      },
    );
  }, [fetchHistoricData]);

  useEffect(() => {
    startLocationTracking();
    // Cleanup function to stop location tracking when component unmounts
    return () => {
      setLocationTracking(false);
      console.log("Locatie wordt niet meer gevolgd");
    };
  }, [startLocationTracking]);

  return (
    <HistoricInfoDisplay
      historicData={historicData}
      errorMsg={errorMsg}
      locationSet={locationSet}
    />
  );
}

export const mainStyles = StyleSheet.create({
  textGray50: { color: "#f9fafb" },
  textGray100: { color: "#f3f4f6" },
  textGray200: { color: "#e5e7eb" },
  textGray300: { color: "#d1d5db" },
  textGray400: { color: "#9ca3af" },
  textGray500: { color: "#6b7280" },
  textGray600: { color: "#4b5563" },
  textGray700: { color: "#374151" },
  textGray800: { color: "#1f2937" },
  textGray900: { color: "#111827" },
  textGray950: { color: "#030712" },
});
