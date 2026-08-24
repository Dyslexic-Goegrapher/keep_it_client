import { DeviceMotion, type DeviceMotionMeasurement } from "expo-sensors";

interface WatchRotationOptions {
  onRotation: (
    rotation: NonNullable<DeviceMotionMeasurement["rotation"]>,
  ) => void;
  onError: (message: string) => void;
}

export async function watchRotation({
  onRotation,
  onError,
}: WatchRotationOptions): Promise<ReturnType<
  typeof DeviceMotion.addListener
> | null> {
  const isAvailable = await DeviceMotion.isAvailableAsync();

  if (!isAvailable) {
    onError("Device motion sensor is not available on this device.");
    return null;
  }

  DeviceMotion.setUpdateInterval(4);

  return DeviceMotion.addListener(({ rotation }) => {
    if (rotation) {
      onRotation(rotation);
    }
  });
}
