import * as Location from "expo-location";

const minimumHeadingDelta = 4;

interface WatchHeadingOptions {
  onHeading: (heading: number) => void;
  onError: (message: string) => void;
}

function normalizeHeadingDelta(delta: number) {
  return ((delta + 540) % 360) - 180;
}

export async function watchHeading({
  onHeading,
  onError,
}: WatchHeadingOptions): Promise<Location.LocationSubscription | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    onError("Toegang tot locatie werd geweigerd");
    return null;
  }

  let previousHeading: number | null = null;

  return Location.watchHeadingAsync(({ trueHeading, magHeading, accuracy }) => {
    const rawHeading = trueHeading >= 0 ? trueHeading : magHeading;
    const heading = Math.round(rawHeading);

    if (accuracy <= 0 || Number.isNaN(heading)) {
      return;
    }

    if (previousHeading !== null) {
      const headingDelta = Math.abs(
        normalizeHeadingDelta(heading - previousHeading),
      );

      if (headingDelta < minimumHeadingDelta) {
        return;
      }
    }

    previousHeading = heading;
    onHeading(heading);
  }, onError);
}
