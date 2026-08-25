import type { Point, FeatureCollection } from "geojson";

export type HistoricItemProperties = {
  erfgoed_id: number;
  naam: string;
  uri: string;
  url: string;
  locatie: string;
  dataverant: string;
  distance?: number;
};

export type HistoricFeatureProperties = HistoricItemProperties & {
  distance: number;
  angle: number;
};

export type HistoricFeatureCollection = FeatureCollection<
  Point,
  HistoricItemProperties
>;
