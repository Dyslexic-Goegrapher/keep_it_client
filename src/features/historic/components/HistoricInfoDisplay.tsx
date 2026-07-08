import { useCallback } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { SafeAreaView } from "react-native-safe-area-context";

import type { HistoricData } from "@/features/historic/hooks/useHistoricData";

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
    <TouchableOpacity
      onPress={() => {
        void handlePress();
      }}
      activeOpacity={0.8}
      disabled={!url}
    >
      <View
        style={[
          styles.containerHistoricItem,
          !url && styles.disabledHistoricItem,
        ]}
      >
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
    adres = historicData.adres;
  }

  return (
    <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.content, styles.container]}
        showsVerticalScrollIndicator={false}
      >
        <OpenURLButton url={historicData.url}>
          {historicData.naam}
        </OpenURLButton>
        <View>
          {historicData.isLoading ? null : (
            <View style={styles.containerAdresHistoricItem}>
              <Ionicons name="location-sharp" size={16} />
              <Text style={styles.textAdresHistoricItem}>{adres}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  container: {
    alignItems: "center",
    marginTop: 50,
  },
  textButtonHistoricItem: {
    fontFamily: "Arial",
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
  },
  containerHistoricItem: {
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
  },
  disabledHistoricItem: {
    opacity: 0.6,
  },
  textAdresHistoricItem: {
    fontFamily: "Arial",
    fontSize: 15,
  },
  containerAdresHistoricItem: {
    flexDirection: "row",
    gap: 4,
  },
});
