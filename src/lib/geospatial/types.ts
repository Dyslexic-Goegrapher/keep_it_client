export interface HistoricItem {
  naam: string;
  url: string;
  adres: string;
}

export interface HistoricItemsData {
  type: "FeatureCollection";
  features: {
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
  }[];
}
