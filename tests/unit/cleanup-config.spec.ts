import { promises as fs, existsSync } from "fs";
import { cleanupConfig } from "src/cleanup-config";

const generatedConfigLocation = "test-file.json";

describe("cleanup-config.ts", () => {
  describe("cleanupConfig()", () => {
    it("should not do anything is cleanup option is false", async () => {
      await fs.writeFile(generatedConfigLocation, "TEST");
      await cleanupConfig({ cleanup: false, generatedConfigLocation } as any);
      expect(existsSync(generatedConfigLocation)).toBeTruthy();
      await fs.unlink(generatedConfigLocation);
    });
    it("should remove generated files", async () => {
      await fs.writeFile(generatedConfigLocation, "TEST");
      await cleanupConfig({ cleanup: true, generatedConfigLocation } as any);
      const exists = existsSync(generatedConfigLocation);
      expect(exists).toBeFalsy();
      if (exists) await fs.unlink(generatedConfigLocation);
    });
  });
});
