import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import { Config } from "src/config";
import { generateConfig } from "src/generate-config";
import { cleanupConfig } from "src/cleanup-config";

/* istanbul ignore next */
/**
 * Generates a config file for api-extractor, then executes it.
 * @param config - The plugin configuration
 * @internal
 */
export async function apiExtractor(config: Config): Promise<void> {
  await generateConfig(config);
  const extractorConfig = await ExtractorConfig.loadFileAndPrepare(config.generatedConfigLocation);
  await cleanupConfig(config);
  const result = await Extractor.invoke(extractorConfig, config.invokeOptions);
  process.exitCode = result.succeeded ? 0 : 1;
}

/**
 * The Api Extractor Rollup Plugin.
 * @remarks
 * Generates a temporary configuration file for api-extractor to use,
 * executes it and cleans up the configuration afterward.
 * @param config - The base configuration to use, can be a file name or an object
 * @param override - Optional overrides for the configuration, if anything but a
 * function is provided, it will be used as a value for a lodash template
 * @param generatedConfigLocation - The location of the generated config file
 * @param cleanup - If the generated config file should be deleted after execution
 * @param invokeOptions - Options to pass to api-extractor
 * @public
 */
export default function({
  config = "./build/api-extractor.json",
  override = "./package.json",
  generatedConfigLocation = "./api-extractor.json",
  cleanup = true,
  invokeOptions = {
    localBuild: process.env.NODE_ENV !== "production",
    showVerboseMessages: process.env.NODE_ENV !== "production"
  }
}: Partial<Config> = {}): any {
  const cfg = { config, override, generatedConfigLocation, cleanup, invokeOptions };
  let ranBefore = false;
  return {
    /* istanbul ignore next */
    async writeBundle(): Promise<void> {
      if (ranBefore) return;
      ranBefore = true;
      return apiExtractor(cfg);
    }
  };
}
