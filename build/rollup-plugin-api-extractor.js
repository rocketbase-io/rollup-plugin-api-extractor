/* eslint-disable */
/**
 * RollupPluginApiExtractor (@rocketbase/rollup-plugin-api-extractor v0.0.0-development)
 * Rollup Plugin for @microsoft/api-extractor
 * https://github.com/rocketbase-io/rollup-plugin-api-extractor#readme
 * (c) 2020 Rocketbase Team <team@rocketbase.io>
 * @license MIT
 */
import { ExtractorConfig, Extractor } from '@microsoft/api-extractor';
import { promises } from 'fs';
import { template } from 'lodash';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

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
function prepareConfig({ config, override }) {
  return __awaiter(this, void 0, void 0, function* () {
    // Overrides is a file, parse and load as lodash template param
    if (typeof override === "string")
      override = yield promises
        .readFile(override)
        .then(it => it.toString("utf8"))
        .then(it => JSON.parse(it));
    // Config is a file, use overrides as lodash template params
    if (typeof config === "string")
      config = yield promises
        .readFile(config)
        .then(it => it.toString("utf8"))
        .then(it => (typeof override === "object" ? template(it)(override) : it))
        .then(it => JSON.parse(it));
    // If override is a function, execute it on the config
    return typeof override === "function" ? yield override(config) : config;
  });
}

/**
 * Generates a config file for api-extractor to use.
 * @param config - The plugin configuration
 * @internal
 */
function generateConfig(config) {
  return __awaiter(this, void 0, void 0, function* () {
    const content = yield prepareConfig(config);
    yield promises.writeFile(config.generatedConfigLocation, JSON.stringify(content, undefined, 2));
  });
}

/**
 * Cleans up the generated config after its use.
 * @param cleanup - If the config should be deleted
 * @param generatedConfigLocation - The location of the generated config file
 * @internal
 */
function cleanupConfig({ cleanup, generatedConfigLocation }) {
  return __awaiter(this, void 0, void 0, function* () {
    if (!cleanup)
      return;
    yield promises.unlink(generatedConfigLocation);
  });
}

/* istanbul ignore next */
/**
 * Generates a config file for api-extractor, then executes it.
 * @param config - The plugin configuration
 * @internal
 */
function apiExtractor(config) {
  return __awaiter(this, void 0, void 0, function* () {
    yield generateConfig(config);
    const extractorConfig = yield ExtractorConfig.loadFileAndPrepare(config.generatedConfigLocation);
    yield cleanupConfig(config);
    const result = yield Extractor.invoke(extractorConfig, config.invokeOptions);
    process.exitCode = result.succeeded ? 0 : 1;
  });
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
function main ({ config = "./build/api-extractor.json", override = "./package.json", generatedConfigLocation = "./api-extractor.json", cleanup = true, invokeOptions = {
  localBuild: process.env.NODE_ENV !== "production",
  showVerboseMessages: process.env.NODE_ENV !== "production"
} } = {}) {
  const cfg = { config, override, generatedConfigLocation, cleanup, invokeOptions };
  let ranBefore = false;
  return {
    /* istanbul ignore next */
    writeBundle() {
      return __awaiter(this, void 0, void 0, function* () {
        if (ranBefore)
          return;
        ranBefore = true;
        return apiExtractor(cfg);
      });
    }
  };
}

export default main;
export { apiExtractor };
