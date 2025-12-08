import { bbox } from "@turf/bbox";
import { buffer } from "@turf/buffer";
import { centroid } from "@turf/centroid";
import { AllGeoJSON, point, featureCollection } from "@turf/helpers";
import { nearestPoint } from "@turf/nearest-point";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Button,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
// test
import * as Device from "expo-device";

import * as Location from "expo-location";

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [naamHistorischObject, setnaamHistorischObject] = useState<string>(
    "Geen historisch object gevonden",
  );
  const [urlHistorischObject, seturlHistorischObject] = useState<string>("");
  const [adresHistorischObject, setadresHistorischObject] = useState<string>(
    "Nog geen adresgegevens gevonden.",
  );
  const [locationSet, setLocationTracking] = useState<boolean>(false);
  interface OpenURLButtonProps {
    url: string;
    children: string;
  }

  interface HistoricItemsData {
    type: string;
    features: [
      {
        type: string;
        id: string;
        geometry: {
          type: string;
          coordinates: [number, number];
        };
        geometry_name: string;
        properties: {
          erfgoed_id: number;
          naam: string;
          uri: string;
          url: string;
          locatie: string;
          dataverant: string;
        };
      },
    ];
  }

  const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Deze URL werkt niet: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  async function startInfoDisplay(x: string, y: string) {
    const currentLocationArray: number[] = [parseFloat(x), parseFloat(y)];
    const currentLocation = point(currentLocationArray);
    const searchRegion: AllGeoJSON | undefined = buffer(currentLocation, 200, {
      units: "meters",
    });
    if (searchRegion) {
      const [minX, minY, maxX, maxY] = bbox(searchRegion);
      const historicItemsUrl = `https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/lu:lu_wet_bk_el_pub/items?bbox=${minX},${minY},${maxX},${maxY}`;
      const historicItemsResponse = await fetch(historicItemsUrl);
      console.log(historicItemsResponse);
      const historicItemsResponseData: HistoricItemsData =
        await historicItemsResponse.json();
      const historicPointFeatures = historicItemsResponseData.features.map(
        (featureToMap) =>
          centroid(featureToMap, {
            properties: featureToMap.properties,
          }),
      );
      console.log(historicItemsResponseData);
      const closestFeature: AllGeoJSON = nearestPoint(
        currentLocation,
        featureCollection(historicPointFeatures),
      );
      const historicImageResponse = await fetch(
        `https://beeldbank.onroerenderfgoed.be/images?sort=type&erfgoedobject=${closestFeature.properties?.url}`,
      );
      console.log(JSON.stringify(historicImageResponse, null, 2));
      setnaamHistorischObject(closestFeature?.properties?.naam);
      seturlHistorischObject(closestFeature?.properties?.url);
      setadresHistorischObject(closestFeature?.properties?.locatie);
    }
  }

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
          startInfoDisplay(
            newLocation.coords.longitude.toFixed(6),
            newLocation.coords.latitude.toFixed(6),
          );
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

  let text = "Nog geen adresgegevens gevonden.";
  if (errorMsg) {
    text = errorMsg;
  } else if (locationSet) {
    text = `${adresHistorischObject}`;
  } else {
    text = "Locatie werd niet gevonden.";
  }

  return (
    <View style={styles.container}>
      <OpenURLButton url={urlHistorischObject}>
        {naamHistorischObject}
      </OpenURLButton>
      <Text />
      <Text style={styles.paragraph}>Locatie: {text}</Text>
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
