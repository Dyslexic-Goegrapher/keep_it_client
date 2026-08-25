import { StyleSheet, Text, View } from "react-native";

import { OpenURLButton } from "@/components/openUrlButton";
import { colors } from "@/themes/colors";
import { spacing } from "@/themes/spacing";

import type { HistoricItemProperties } from "../../../types/historic";

interface HistoricInfoDisplayProps {
  historicData: HistoricItemProperties;
  relativeAngle: number | null;
  errorMsg: string | null;
  locationSet: boolean;
}

export default function HistoricInfoDisplay({
  historicData,
  errorMsg,
}: HistoricInfoDisplayProps) {
  return (
    <View style={styles.container}>
      <OpenURLButton url={historicData.url}>
        {errorMsg ? errorMsg : historicData.naam}
      </OpenURLButton>
      {typeof historicData.distance === "number" ? (
        <Text style={styles.distanceText}>
          {`${Math.round(historicData.distance)} m`}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    rowGap: spacing.xs,
  },
  distanceText: {
    color: colors.grey800,
    fontSize: 12,
  },
});
