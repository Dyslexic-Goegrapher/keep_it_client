import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from "react-native";
import { useCallback } from "react";
import { sizes } from "@/themes/sizes";
import { colors } from "@/themes/colors";

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
      <Text style={styles.titleContent}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  titleContent: {
    fontSize: sizes.sm,
    color: colors.blue,
  },
});
