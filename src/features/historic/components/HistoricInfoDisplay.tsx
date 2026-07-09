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
      <View>
        <Text>{children}</Text>
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
    <SafeAreaView edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <OpenURLButton url={historicData.url}>
          {historicData.naam}
        </OpenURLButton>
        <View>
          {historicData.isLoading ? null : (
            <View>
              <Ionicons name="location-sharp" size={16} />
              <Text>{adres}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
