module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  env: {
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  rules: {
    "no-console": "error",
    "no-debugger": "error",
    "@typescript-eslint/no-explicit-any": "off"
  },
  overrides: [
    {
      files: ["**/tests/unit/**/*.spec.{j,t}s?(x)"],
      env: { jest: true }
    }
  ]
};
