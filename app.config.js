const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  name: IS_DEV ? "Keep_IT (Dev)" : "Keep_IT",
  slug: "Keep_IT",
  ios: {
    bundleIdentifier: IS_DEV ? "com.keep_it.dev" : "com.keep_it",
  },
  android: {
    package: IS_DEV ? "com.keep_it.dev" : "com.keep_it",
  },
  extra: {
    eas: {
      projectId: "f6688fc7-eccc-403e-bc1e-428d9bb79910",
    },
  },
};
