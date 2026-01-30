import { bbox } from "@turf/bbox";
import { buffer } from "@turf/buffer";
import { centroid } from "@turf/centroid";
import { AllGeoJSON, point, featureCollection } from "@turf/helpers";
import { nearestPoint } from "@turf/nearest-point";
import { useState, useTransition } from "react";

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

/**
 *
 * @todo refactor this to index.ts
 * @param x
 * @param y
 * @returns
 */
export default function InfoDisplay(x: string, y: string) {
  const [naamHistorischObject, setnaamHistorischObject] = useState<string>(
    "Geen historisch object gevonden",
  );
  const [urlHistorischObject, seturlHistorischObject] = useState<string>("");
  const [adresHistorischObject, setadresHistorischObject] = useState<string>(
    "Nog geen adresgegevens gevonden.",
  );
  const [isPending, startTransition] = useTransition();

  const currentLocationArray: number[] = [parseFloat(x), parseFloat(y)];
  const currentLocation = point(currentLocationArray);
  const searchRegion: AllGeoJSON | undefined = buffer(currentLocation, 200, {
    units: "meters",
  });
  if (searchRegion) {
    const [minX, minY, maxX, maxY] = bbox(searchRegion);
    const historicItemsUrl = `https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/lu:lu_wet_bk_el_pub/items?bbox=${minX},${minY},${maxX},${maxY}`;
    startTransition(async () => {
      const historicItemsResponse = await fetch(historicItemsUrl);
      console.log(historicItemsResponse);
      const historicItemsResponseData: HistoricItemsData =
        await historicItemsResponse.json();
      const historicPointFeatures = historicItemsResponseData.features.map(
        (featureToMap) =>
          centroid(featureToMap, {
            properties: featureToMap.properties,
          }),
      );
      console.log(historicItemsResponseData);
      const closestFeature: AllGeoJSON = nearestPoint(
        currentLocation,
        featureCollection(historicPointFeatures),
      );
      const historicImageResponse = await fetch(
        `https://beeldbank.onroerenderfgoed.be/images?sort=type&erfgoedobject=${closestFeature.properties?.url}`,
      );
      console.log(JSON.stringify(historicImageResponse, null, 2));

      const historischObject = {
        naam: closestFeature?.properties?.naam,
        url: closestFeature?.properties?.url,
        locatie: closestFeature?.properties?.locatie,
      };
      return historischObject;
    });
  }
  return (
    <View style={styles.container}>
      <OpenURLButton url={historischObject}>
        {naamHistorischObject}
      </OpenURLButton>
      <Text />
      <Text style={styles.paragraph}>Locatie: {text}</Text>
    </View>
  );
}
