import * as Device from "expo-device";
import * as Location from "expo-location";
import { Platform } from "react-native";

interface WatchForegroundLocationOptions {
  onLocation: (coords: Pick<Location.LocationObjectCoords, "longitude" | "latitude" | "heading">) => void;
  onError: (message: string) => void;
}

export async function watchForegroundLocation({
  onLocation,
  onError,
}: WatchForegroundLocationOptions): Promise<Location.LocationSubscription | null> {
  if (Platform.OS === "android" && !Device.isDevice) {
    onError(
      "Oops, this will not work on Snack in an Android Emulator. Try it on your device!",
    );
    return null;
  }

  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    onError("Toegang tot locatie werd geweigerd");
    return null;
  }

  return Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 1000,
      distanceInterval: 10,
    },
    (newLocation) => {
      if (
        typeof newLocation?.coords?.longitude === "number" &&
        typeof newLocation?.coords?.latitude === "number"
      ) {
        onLocation({
          longitude: newLocation.coords.longitude,
          latitude: newLocation.coords.latitude,
          heading: newLocation.coords.heading,
        });
      }
    },
  );
}
