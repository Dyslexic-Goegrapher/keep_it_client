const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "Keep_IT (Dev)" : "Keep_IT",
  slug: "Keep_IT",
  icon: "./assets/images/icon.png",
  ios: {
    bundleIdentifier: IS_DEV ? "com.keepit.dev" : "com.keepit",
  },
  android: {
    package: IS_DEV ? "com.keepit.dev" : "com.keepit",
    adaptiveIcon: {
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
  },
  extra: {
    eas: {
      projectId: "f6688fc7-eccc-403e-bc1e-428d9bb79910",
    },
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-image",
    "expo-status-bar",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#F7F7F7",
        image: "./assets/images/android-icon-foreground.png",
        resizeMode: "cover",
      },
    ],
    [
      "expo-sensors",
      {
        motionPermissions: "Allow $(PRODUCT_NAME) to access your device motion",
      },
    ],
  ],
};
