import { bbox } from "@turf/bbox";
import { buffer } from "@turf/buffer";
import { centroid } from "@turf/centroid";
import { featureCollection, point } from "@turf/helpers";

import type { HistoricFeatureCollection } from "../types/historic";

const geoAPIMercatorCollections =
  "https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/";
const collectionHistoricItems = "lu:lu_wet_bk_el_pub";

export async function fetchNearHistoricItems(
  longitude: number,
  latitude: number,
): Promise<HistoricFeatureCollection> {
  const currentLocation = point([longitude, latitude]);
  const searchRegion = buffer(currentLocation, 200, {
    units: "meters",
  });
  if (!searchRegion) {
    console.warn("Search region is empty");
    return featureCollection([]);
  }

  const [minX, minY, maxX, maxY] = bbox(searchRegion);

  const historicItemsUrl = new URL(
    `${geoAPIMercatorCollections}${collectionHistoricItems}/items`,
  );
  historicItemsUrl.searchParams.append(
    "bbox",
    `${minX},${minY},${maxX},${maxY}`,
  );

  const response = await fetch(historicItemsUrl);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const historicItemsResponseData =
    (await response.json()) as HistoricFeatureCollection;
  if (historicItemsResponseData.features.length === 0) {
    return featureCollection([]);
  }

  return featureCollection(
    historicItemsResponseData.features.map((featureToMap) =>
      centroid(featureToMap, {
        properties: featureToMap.properties,
      }),
    ),
  );
}
