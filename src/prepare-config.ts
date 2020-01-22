import { Config } from "src/config";
import { promises as fs } from "fs";
import { template } from "lodash";

/**
 * Parses any configuration files or file overrides and returns a parsed, final
 * configuration.
 *
 * @remarks
 * It works differently dependent on what parameter types are given.
 * If a string is given as the config parameter, it is assumed to be a
 * file path and will be loaded, treated as a lodash template and then parsed
 * with JSON.parse. If an object is given, it is used as is, no parsing or
 * template replacing.
 *
 * If override is a function, it is executed on the final config and the result
 * is returned, else it is treated as a configuration object for the lodash
 * template.
 *
 * @param config - The configuration file to load or an object, skipping the parsing
 * @param override - Overrides for the configuration
 * @internal
 */
export async function prepareConfig({ config, override }: Config): Promise<any> {
  // Overrides is a file, parse and load as lodash template param
  if (typeof override === "string")
    override = await fs
      .readFile(override)
      .then(it => it.toString("utf8"))
      .then(it => JSON.parse(it));
  // Config is a file, use overrides as lodash template params
  if (typeof config === "string")
    config = await fs
      .readFile(config)
      .then(it => it.toString("utf8"))
      .then(it => (typeof override === "object" ? template(it)(override) : it))
      .then(it => JSON.parse(it));
  // If override is a function, execute it on the config
  return typeof override === "function" ? await override(config) : config;
}
