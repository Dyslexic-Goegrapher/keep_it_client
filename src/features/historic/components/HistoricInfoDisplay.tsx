import { StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { OpenURLButton } from "@/components/openUrlButton";
import { sizes } from "@/themes/sizes";
import { spacing } from "@/themes/spacing";

import type { HistoricItemProperties } from "../../../types/historic";

interface HistoricInfoDisplayProps {
  historicData: HistoricItemProperties;
  errorMsg: string | null;
  locationSet: boolean;
}

export default function HistoricInfoDisplay({
  historicData,
  errorMsg,
  locationSet,
}: HistoricInfoDisplayProps) {
  return (
    <>
      <OpenURLButton url={historicData.url}>
        {errorMsg ? errorMsg : historicData.naam}
      </OpenURLButton>
      <View>
        {historicData.locatie ? (
          <View style={styles.adresContainer}>
            <Ionicons name="location-sharp" size={sizes.sm} />
            <Text style={styles.adresContent}>{historicData.locatie}</Text>
          </View>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  adresContainer: {
    flexDirection: "row",
    fontSize: sizes.md,
    padding: spacing.md,
  },
  adresContent: {
    fontSize: sizes.sm,
  },
});
