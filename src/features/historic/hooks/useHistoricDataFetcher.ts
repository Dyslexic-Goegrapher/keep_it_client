import { useCallback, useState } from "react";

import { point } from "@turf/helpers";

import type { HistoricFeatureCollection } from "../../../types/historic";

import { fetchNearestPoints } from "@/lib/geospatial";
import { fetchNearHistoricItems } from "@/lib/fetchNearHistoricItems";

export interface HistoricDataFetcher {
  data: HistoricFeatureCollection;
  isFetching: boolean;
}

export default function useHistoricDataFetcher() {
  const [historicDataFetcher, setHistoricDataFetcher] =
    useState<HistoricDataFetcher>({
      data: {} as HistoricFeatureCollection,
      isFetching: true,
    });
  const fetchHistoricData = useCallback(
    async (longitude: number, latitude: number, amount: number) => {
      try {
        const historicItems = await fetchNearHistoricItems(longitude, latitude);
        const nearHistoricItems = fetchNearestPoints(
          point([longitude, latitude]),
          amount,
          historicItems,
        );
        if (nearHistoricItems) {
          setHistoricDataFetcher({
            data: nearHistoricItems as HistoricFeatureCollection,
            isFetching: false,
          });
        } else {
          setHistoricDataFetcher({
            data: {
              type: "FeatureCollection",
              features: [],
            },
            isFetching: false,
          });
        }
      } catch (error) {
        console.error("Failed set historic data with error:", error);
        setHistoricDataFetcher({
          data: {
            type: "FeatureCollection",
            features: [],
          },
          isFetching: false,
        });
      }
    },
    [],
  );

  return {
    historicDataFetcher,
    fetchHistoricData,
  };
}
