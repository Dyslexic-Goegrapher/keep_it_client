import { distance } from "@turf/distance";
import { featureCollection } from "@turf/helpers";
import type { FeatureCollection, Feature, Point } from "geojson";

export function fetchNearestPoints(
  targetPoint: Feature<Point>,
  amount: number,
  targetFeaturecollection: FeatureCollection<Point>,
): FeatureCollection<Point> {
  const nearestPoints = targetFeaturecollection.features
    .map((feature) => ({
      ...feature,
      properties: {
        ...feature.properties,
        distance: distance(targetPoint, feature, { units: "meters" }),
      },
    }))
    .sort(
      (firstFeature, secondFeature) =>
        (firstFeature.properties?.distance ?? Infinity) -
        (secondFeature.properties?.distance ?? Infinity),
    )
    .slice(0, amount);

  return featureCollection(nearestPoints);
}
