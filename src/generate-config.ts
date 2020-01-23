import { promises as fs } from "fs";
import { Config } from "src/config";
import { prepareConfig } from "src/prepare-config";

/**
 * Generates a config file for api-extractor to use.
 * @param config - The plugin configuration
 * @internal
 */
export async function generateConfig(config: Config): Promise<void> {
  const content = await prepareConfig(config);
  await fs.writeFile(config.generatedConfigLocation, JSON.stringify(content, undefined, 2));
}
