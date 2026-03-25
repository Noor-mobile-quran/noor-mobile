const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Alias native-only packages to web-safe stubs when bundling for web.
// react-native-mmkv uses react-native-nitro-modules which calls
// TurboModuleRegistry.getEnforcing() at module init — this throws on web
// even if the code path is guarded by Platform.OS checks.
config.resolver = config.resolver || {};
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web") {
    if (moduleName === "react-native-mmkv") {
      return {
        filePath: path.resolve(__dirname, "lib/mmkv-web-stub.js"),
        type: "sourceFile",
      };
    }
  }
  // Fall through to default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
