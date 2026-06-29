import { useState, useCallback } from "react";
import { bbox } from "@turf/bbox";
import { buffer } from "@turf/buffer";
import { centroid } from "@turf/centroid";
import { AllGeoJSON, point, featureCollection } from "@turf/helpers";
import { nearestPoint } from "@turf/nearest-point";

interface HistoricItemsData {
  type: "FeatureCollection";
  features: [
    {
      type: "Feature";
      id: string;
      geometry: {
        type: "Point";
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

export interface HistoricData {
  naam: string;
  url: string;
  adres: string;
}

const defaultData: HistoricData = {
  naam: "Geen historisch object gevonden",
  url: "",
  adres: "Nog geen adresgegevens gevonden.",
};

export default function useHistoricData() {
  const [historicData, setHistoricData] = useState<HistoricData>(defaultData);

  const fetchHistoricData = useCallback(async (x: string, y: string) => {
    const currentLocationArray: number[] = [parseFloat(x), parseFloat(y)];
    const currentLocation = point(currentLocationArray);
    const searchRegion: AllGeoJSON | undefined = buffer(currentLocation, 200, {
      units: "meters",
    });
    if (searchRegion) {
      const [minX, minY, maxX, maxY] = bbox(searchRegion);
      const historicItemsUrl = `https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/lu:lu_wet_bk_el_pub/items?bbox=${minX},${minY},${maxX},${maxY}`;
      const historicItemsResponse = await fetch(historicItemsUrl);
      const historicItemsResponseData: HistoricItemsData =
        await historicItemsResponse.json();
      const historicPointFeatures = historicItemsResponseData.features.map(
        (featureToMap) =>
          centroid(featureToMap, {
            properties: featureToMap.properties,
          }),
      );
      const closestFeature: AllGeoJSON = nearestPoint(
        currentLocation,
        featureCollection(historicPointFeatures),
      );
      setHistoricData({
        naam: closestFeature?.properties?.naam,
        url: closestFeature?.properties?.url,
        adres: closestFeature?.properties?.locatie,
      });
    }
  }, []);

  return {
    historicData,
    fetchHistoricData,
  };
}
