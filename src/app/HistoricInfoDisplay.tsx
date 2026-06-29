import { useCallback } from "react";
import {
  StyleSheet,
  Alert,
  Linking,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

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

const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Deze URL werkt niet: ${url}`);
    }
  }, [url]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.containerHistoricItem}>
        <Text style={styles.textButtonHistoricItem}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function HistoricInfoDisplay({
  historicData,
  errorMsg,
  locationSet,
}: HistoricInfoDisplayProps) {
  let adres = "";
  if (errorMsg) {
    adres = errorMsg;
  } else if (locationSet) {
    adres = `${historicData.adres}`;
  } else {
    adres = "Locatie werd niet gevonden.";
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <OpenURLButton url={historicData.url}>
          {historicData.naam}
        </OpenURLButton>
        <View>
          <View>
            <View style={styles.containerAdresHistoricItem}>
              <Ionicons name="location-sharp" size={16} color="#626262" />
              <Text style={styles.textAdresHistoricItem}>{adres}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  textButtonHistoricItem: {
    fontFamily: "Arial",
    color: "#626262",
    fontWeight: "bold",
    fontSize: 30,
  },
  containerHistoricItem: {
    backgroundColor: "#CFCFCF",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  textAdresHistoricItem: {
    fontFamily: "Arial",
    color: "#626262",
    fontSize: 15,
  },
  containerAdresHistoricItem: {
    flexDirection: "row",
    gap: 4,
  },
  red: {
    color: "red",
  },
});
