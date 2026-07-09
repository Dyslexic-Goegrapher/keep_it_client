import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { useCallback } from "react";
import { sizes } from "@/themes/sizes";
import { colors } from "@/themes/colors";
import { radius } from "@/themes/radius";
import { spacing } from "@/themes/spacing";

interface OpenURLButtonProps {
  url: string;
  children: string;
}

export const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
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
      <View style={styles.titleContainer}>
        <Text style={styles.titleContent}>{children}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleContent: {
    fontSize: sizes.lg,
    color: colors.blue,
  },
  titleContainer: {
    borderRadius: radius.md,
    backgroundColor: colors.grey100,
    padding: spacing.md,
  },
});
