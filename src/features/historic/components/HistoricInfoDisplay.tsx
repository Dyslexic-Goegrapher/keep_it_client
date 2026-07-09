import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { OpenURLButton } from "@/components/openUrlButton";
import type { HistoricData } from "@/features/historic/hooks/useHistoricData";
import { colors } from "@/themes/colors";
import { sizes } from "@/themes/sizes";
import { spacing } from "@/themes/spacing";

interface HistoricInfoDisplayProps {
  historicData: HistoricData;
  errorMsg: string | null;
  locationSet: boolean;
}

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
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <ScrollView
        style={styles.infoContainer}
        contentContainerStyle={styles.infoContent}
        showsVerticalScrollIndicator={false}
      >
        <OpenURLButton url={historicData.url}>
          {historicData.naam}
        </OpenURLButton>
        <View>
          {historicData.isLoading ? null : (
            <View style={styles.adresContainer}>
              <Ionicons name="location-sharp" size={sizes.sm} />
              <Text style={styles.adresContent}>{adres}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoContainer: {
    backgroundColor: colors.grey50,
  },
  infoContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial",
  },
  adresContainer: {
    flexDirection: "row",
    fontSize: sizes.md,
    padding: spacing.md,
  },
  adresContent: {
    fontSize: sizes.sm,
  },
});
