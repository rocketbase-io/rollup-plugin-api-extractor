import { Config } from "src/config";
import { promises as fs } from "fs";

/**
 * Cleans up the generated config after its use.
 * @param cleanup - If the config should be deleted
 * @param generatedConfigLocation - The location of the generated config file
 * @internal
 */
export async function cleanupConfig({ cleanup, generatedConfigLocation }: Config): Promise<void> {
  if (!cleanup) return;
  await fs.unlink(generatedConfigLocation);
}
