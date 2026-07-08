import { useCallback, useState } from "react";

import { fetchNearestHistoricItem } from "@/lib/geospatial/findClosestPoints";

export interface HistoricData {
  naam: string;
  url: string;
  adres: string;
  isLoading: boolean;
}

const defaultData: HistoricData = {
  naam: "Data laden...",
  url: "",
  adres: "",
  isLoading: true,
};

export default function useHistoricData() {
  const [historicData, setHistoricData] = useState<HistoricData>(defaultData);

  const fetchHistoricData = useCallback(
    async (longitude: number, latitude: number) => {
      try {
        const nextHistoricItem = await fetchNearestHistoricItem(
          longitude,
          latitude,
        );

        if (!nextHistoricItem) {
          setHistoricData({
            naam: "Geen historisch object gevonden",
            url: "",
            adres: "",
            isLoading: false,
          });
          return;
        }

        setHistoricData({
          ...nextHistoricItem,
          isLoading: false,
        });
      } catch {
        setHistoricData({
          naam: "Historische data kon niet geladen worden",
          url: "",
          adres: "",
          isLoading: false,
        });
      }
    },
    [],
  );

  return {
    historicData,
    fetchHistoricData,
  };
}
