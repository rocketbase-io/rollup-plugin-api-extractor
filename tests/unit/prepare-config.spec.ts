import { promises as fs, existsSync } from "fs";
import { prepareConfig } from "src/prepare-config";

describe("prepare-config.ts", () => {
  describe("prepareConfig()", () => {
    it("should return the config as is if an object and no overrides are given", async () => {
      const config = { name: "test" };
      const override = {};
      const result = await prepareConfig({ config, override } as any);
      expect(result).toEqual(config);
    });

    it("should modify the configuration if a modification function is given", async () => {
      const config = { name: "test" };
      const override = async (cfg: any) => ({ ...cfg, hello: "world" });
      const result = await prepareConfig({ config, override } as any);
      expect(result).toEqual({ name: "test", hello: "world" });
    });

    it("should read config file from file system and apply lodash replacement", async () => {
      const config = "test-config.json";
      const override = { name: "test" };
      await fs.writeFile(config, `"<%= name %>"`);
      const result = await prepareConfig({ config, override } as any);
      await fs.unlink(config);
      expect(result).toEqual("test");
    });

    it("should read overrides from file system", async () => {
      const config = "test-config.json";
      const override = "test-data.json";
      await fs.writeFile(config, `"<%= name %>"`);
      await fs.writeFile(override, `{"name":"test"}`);
      const result = await prepareConfig({ config, override } as any);
      await fs.unlink(config);
      await fs.unlink(override);
      expect(result).toEqual("test");
    });
  });
});
