const tsConfig = require("../../eslint.config.typescript");

const { parserOptions: tsParserOptions, settings: tsSettings } = tsConfig;

module.exports = {
  ...tsConfig,
  parserOptions: {
    ...tsParserOptions,
    tsconfigRootDir: __dirname,
  },
  root: true,
};
