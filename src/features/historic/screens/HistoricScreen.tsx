import { useCallback, useEffect, useState } from "react";

import HistoricInfoDisplay from "@/features/historic/components/HistoricInfoDisplay";
import useHistoricData from "@/features/historic/hooks/useHistoricData";
import { watchForegroundLocation } from "@/lib/geospatial/watchForegroundLocation";

export default function HistoricScreen() {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [locationSet, setLocationTracking] = useState(false);

  const { historicData, fetchHistoricData } = useHistoricData();

  const startLocationTracking = useCallback(async () => {
    return watchForegroundLocation({
      onLocation: ({ longitude, latitude }) => {
        setErrorMsg(null);
        setLocationTracking(true);
        void fetchHistoricData(longitude, latitude);
      },
      onError: setErrorMsg,
    });
  }, [fetchHistoricData]);

  useEffect(() => {
    let isActive = true;
    let subscription: Awaited<ReturnType<typeof watchForegroundLocation>> =
      null;

    const start = async () => {
      const nextSubscription = await startLocationTracking();

      if (!isActive) {
        nextSubscription?.remove();
        return;
      }

      subscription = nextSubscription;
    };

    void start();

    return () => {
      isActive = false;
      subscription?.remove();
      setLocationTracking(false);
    };
  }, [startLocationTracking]);

  return (
    <HistoricInfoDisplay
      historicData={historicData}
      errorMsg={errorMsg}
      locationSet={locationSet}
    />
  );
}
