import { promises as fs, existsSync } from "fs";
import { generateConfig } from "src/generate-config";

describe("generate-config.ts", () => {
  describe("generateConfig()", () => {
    it("should generate a config file", async () => {
      const config = { name: "test" };
      const override = {};
      const generatedConfigLocation = "test-file.json";
      await generateConfig({ config, override, generatedConfigLocation } as any);
      const exists = existsSync(generatedConfigLocation);
      if (exists) await fs.unlink(generatedConfigLocation);
      expect(exists).toBeTruthy();
    });
  });
});
