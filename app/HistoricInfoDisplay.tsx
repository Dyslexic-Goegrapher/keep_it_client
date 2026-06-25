import { useCallback } from "react";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";

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

export default function HistoricInfoDisplay({
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

    return (
      <TouchableOpacity
        style={styles.vintageButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.buttonInner}>
          <Text style={styles.buttonText}>{children}</Text>
        </View>
      </TouchableOpacity>
    );
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
    <View style={styles.outerContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.parchment}>
          {/* Decorative corner ornaments */}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />

          {/* Header with vintage styling */}
          <View style={styles.header}>
            <View style={styles.dividerLine} />
            <Text style={styles.headerText}>Historisch Object</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Main content */}
          <View style={styles.content}>
            <OpenURLButton url={historicData.url}>
              {historicData.naam}
            </OpenURLButton>

            <View style={styles.locationSection}>
              <Text style={styles.locationLabel}>Locatie</Text>
              <View style={styles.locationBox}>
                <Text style={styles.locationText}>{text}</Text>
              </View>
            </View>
          </View>

          {/* Footer decoration */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>✦ ✦ ✦</Text>
          </View>
        </View>

        <WebView
          scalesPageToFit={true}
          bounces={false}
          javaScriptEnabled
          style={{ height: 500, width: 300 }}
          source={{
            html: `
                    <iframe src="${historicData.url}"
                                title="iframe Example 1" width="400" height="300">
                    </iframe>
                    `,
          }}
          automaticallyAdjustContentInsets={false}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#2c2416",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  parchment: {
    backgroundColor: "#f4e4bc",
    borderRadius: 4,
    padding: 24,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#d4c4a0",
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#8b7355",
    borderWidth: 3,
  },
  cornerTopLeft: {
    top: 12,
    left: 12,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: 12,
    right: 12,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: 12,
    left: 12,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: 12,
    right: 12,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    marginTop: 8,
  },
  dividerLine: {
    height: 1,
    backgroundColor: "#8b7355",
    width: "40%",
    marginVertical: 8,
  },
  headerText: {
    fontSize: 12,
    letterSpacing: 4,
    color: "#8b7355",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  content: {
    alignItems: "center",
    paddingVertical: 16,
  },
  vintageButton: {
    backgroundColor: "#6b4423",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#8b6914",
    width: "100%",
  },
  buttonInner: {
    borderWidth: 1,
    borderColor: "#a67c52",
    borderRadius: 4,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#f4e4bc",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.5,
    textShadowColor: "#3d2314",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  locationSection: {
    marginTop: 32,
    alignItems: "center",
    width: "100%",
  },
  locationLabel: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#8b7355",
    textTransform: "uppercase",
    marginBottom: 12,
    fontWeight: "600",
  },
  locationBox: {
    backgroundColor: "#e8dcc8",
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: "#c4b49a",
    width: "100%",
    shadowColor: "#8b7355",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  locationText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    color: "#4a3f35",
    fontStyle: "italic",
  },
  footer: {
    marginTop: 24,
    alignItems: "center",
  },
  footerText: {
    color: "#8b7355",
    fontSize: 14,
    letterSpacing: 8,
  },
});
