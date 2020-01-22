import { IExtractorInvokeOptions } from "@microsoft/api-extractor";

/**
 * The parameters to this plugin
 * @public
 */
export interface Config {
  config: string | any;
  override: string | any | ((config: any) => any);
  generatedConfigLocation: string;
  cleanup: boolean;
  invokeOptions: IExtractorInvokeOptions;
}
