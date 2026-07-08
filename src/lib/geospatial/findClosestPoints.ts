import { bbox } from "@turf/bbox";
import { buffer } from "@turf/buffer";
import { centroid } from "@turf/centroid";
import { featureCollection, point } from "@turf/helpers";
import { nearestPoint } from "@turf/nearest-point";

import type { HistoricItem, HistoricItemsData } from "./types";

export async function fetchNearestHistoricItem(
  longitude: number,
  latitude: number,
): Promise<HistoricItem | null> {
  const currentLocation = point([longitude, latitude]);
  const searchRegion = buffer(currentLocation, 200, {
    units: "meters",
  });
  if (!searchRegion) {
    return null;
  }

  const [minX, minY, maxX, maxY] = bbox(searchRegion);
  const historicItemsUrl = `https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/lu:lu_wet_bk_el_pub/items?bbox=${minX},${minY},${maxX},${maxY}`;

  const response = await fetch(historicItemsUrl);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const historicItemsResponseData =
    (await response.json()) as HistoricItemsData;
  if (historicItemsResponseData.features.length === 0) {
    return null;
  }

  const historicPointFeatures = historicItemsResponseData.features.map(
    (featureToMap) =>
      centroid(featureToMap, {
        properties: featureToMap.properties,
      }),
  );
  const closestFeature = nearestPoint(
    currentLocation,
    featureCollection(historicPointFeatures),
  );

  return {
    naam: closestFeature.properties?.naam ?? "Onbekend historisch object",
    url: closestFeature.properties?.url ?? "",
    adres: closestFeature.properties?.locatie ?? "",
  };
}
