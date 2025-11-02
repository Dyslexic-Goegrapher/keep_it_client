import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Linking, Platform, StyleSheet, Text, View } from "react-native";

import * as Device from "expo-device";

import * as Location from "expo-location";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export default function App() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [naamHistorischObject, setnaamHistorischObject] = useState<string>('Geen historisch object gevonden');
  const [urlHistorischObject, seturlHistorischObject] = useState<string>('');
  const [adresHistorischObject, setadresHistorischObject] = useState<string>('Geen adres gevonden');
  const [locationSet, setLocationTracking] = useState<boolean>(false);

  type OpenURLButtonProps = {
    url: string;
    children: string;
  };

  const OpenURLButton = ({url, children}: OpenURLButtonProps) => {
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
      const bboxBuffer: Float = 0.001;
      const historicItemsUrl = `https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/lu:lu_wet_bk_el_pub/items?bbox=${parseFloat(x) - bboxBuffer},${parseFloat(y) - bboxBuffer},${parseFloat(x) + bboxBuffer},${parseFloat(y) + bboxBuffer}`;
      const historicItemsResponse = await fetch(historicItemsUrl);
      const historicItemsResponseData = await historicItemsResponse.json();
      console.log(historicItemsResponseData.features[0]?.properties || {});
      setnaamHistorischObject(historicItemsResponseData.features[0]?.properties?.naam || 'Nog geen naam gevonden');
      seturlHistorischObject(historicItemsResponseData.features[0]?.properties?.url || 'Nog geen url gevonden');
      setadresHistorischObject(historicItemsResponseData.features[0]?.properties?.locatie || 'Nog geen adres gevonden');
    };
  
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

      // Start continuous location tracking
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 1, // Update every 1 meter
        },
        (newLocation) => {
          if (newLocation?.coords?.longitude && newLocation?.coords?.latitude) {
            setLocationTracking(true);
            startInfoDisplay(
              newLocation.coords.longitude.toFixed(6),
              newLocation.coords.latitude.toFixed(6)
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

  let text = "Wachtend op info historisch object";
  let url = "Wachtend op url historisch object";
  let naamObject = "Wachtend op naam historisch object";
  if (errorMsg) {
    text = errorMsg;
  } else if (locationSet) {
    text = `Locatie: ${adresHistorischObject}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historisch object</Text>
      <OpenURLButton url={urlHistorischObject}>{naamHistorischObject}</OpenURLButton>
      <Text></Text>
      <Text style={styles.paragraph}>{text}</Text>
      <Text style={styles.status}>
        Status: {locationSet ? "🟢 Locatie is geweten" : "🔴 Locatie zoeken"}
      </Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "600",
  },
  paragraph: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#666",
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    fontStyle: "italic",
  },
});
