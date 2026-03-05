import { useCallback } from "react";
import { Alert, Text, Linking, Button } from "react-native";

import { HistoricData } from "./types";

/**
 *
 * @param historicData
 * @returns
 */
export default function HistoricItem({ historicData }: { historicData: HistoricData }) {
  const OpenURLButton = ({ url, children }: { url: string; children: string }) => {
    const handlePress = useCallback(async () => {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(url);
      } else {
        Alert.alert(`Deze URL werkt niet: ${url}`);
      }
    }, [url]);

    return <Button title={children} onPress={handlePress} />;
  };

  return (
    <>
      <OpenURLButton url={historicData.properties.url}>
        {historicData.properties.naam}
      </OpenURLButton>
      <Text>{historicData.properties.naam}</Text>
    </>
  );
}
