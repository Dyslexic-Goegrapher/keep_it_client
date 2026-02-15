import { useCallback } from "react";
import { Alert, Text, Linking, Button } from "react-native";
import { OpenURLButtonProps, HistoricItemsData } from "./types";

/**
 *
 * @param historicData
 * @returns
 */
export default function HistoricItem(historicData: HistoricItemsData) {
  const OpenURLButton = ({ url, children }: OpenURLButtonProps) => {
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
      <OpenURLButton url={historicData.features[0].properties.url}>
        {historicData.features[0].properties.naam}
      </OpenURLButton>
      <Text>{historicData.features[0].properties.naam}</Text>
    </>
  );
}
