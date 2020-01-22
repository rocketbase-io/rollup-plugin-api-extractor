import { default as main } from "src/main";

describe("main.ts", () => {
  describe("default()", () => {
    it("should return a rollup plugin", () => {
      const plugin = main();
      expect(plugin).toBeTruthy();
      expect(typeof plugin.writeBundle).toBe("function");
    });
  });
});
