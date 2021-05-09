// extend top level eslint config
// const mainConfig = require("../../.eslintrc");
const tsConfig = require("../../eslint.config.typescript");

module.exports = {
  ...tsConfig,
  parserOptions: {
    ...tsParserOptions,
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  root: true,
};
