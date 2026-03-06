import { useCallback } from "react";
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { HistoricData } from "./useHistoricData";

interface OpenURLButtonProps {
  url: string;
  children: string;
}

interface HistoricInfoDisplayProps {
  historicData: HistoricData;
  errorMsg: string | null;
  locationSet: boolean;
}

export function HistoricInfoDisplay({
  historicData,
  errorMsg,
  locationSet,
}: HistoricInfoDisplayProps) {
  const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
    const handlePress = useCallback(async () => {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(`Deze URL werkt niet: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  let text = "Nog geen adresgegevens gevonden.";
  if (errorMsg) {
    text = errorMsg;
  } else if (locationSet) {
    text = `${historicData.adres}`;
  } else {
    text = "Locatie werd niet gevonden.";
  }

  return (
    <View style={styles.container}>
      <OpenURLButton url={historicData.url}>
        {historicData.naam}
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