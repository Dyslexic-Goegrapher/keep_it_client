import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Location from "expo-location";

import { useHistoricData } from "./useHistoricData";
import { HistoricInfoDisplay } from "./HistoricInfoDisplay";

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