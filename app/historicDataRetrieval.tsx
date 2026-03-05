
import { HistoricData } from "./types";

export function LocationInfo(longitude: number, latitude: number): HistoricData {
  return {
    properties: {
      naam: "testnaam",
      url: "example.com",
    },
  };
}
