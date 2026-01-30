import { useCallback } from "react";
import { Alert, Text, Linking, Button } from "react-native";

interface HistoricItemsData {
  type: string;
  features: [
    {
      type: string;
      id: string;
      geometry: {
        type: string;
        coordinates: [number, number];
      };
      geometry_name: string;
      properties: {
        erfgoed_id: number;
        naam: string;
        uri: string;
        url: string;
        locatie: string;
        dataverant: string;
      };
    },
  ];
}

interface OpenURLButtonProps {
  url: string;
  children: string;
}

/**
 *
 * @param historicData
 * @returns
 */
export default function HistoricItem(historicData: HistoricItemsData) {
  const historicItem: HistoricItemsData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "1",
        geometry: {
          type: "Point",
          coordinates: [5.123456, 52.345678],
        },
        geometry_name: "geometry",
        properties: {
          erfgoed_id: 1,
          naam: "Historic Object 1",
          uri: "https://example.com/object1",
          url: "https://example.com/object1",
          locatie: "Location 1",
          dataverant: "Owner 1",
        },
      },
    ],
  };
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
      <OpenURLButton url={historicItem.features[0].properties.url}>
        {historicItem.features[0].properties.naam}
      </OpenURLButton>
      <Text>{historicItem.features[0].properties.naam}</Text>
    </>
  );
}
