// extend top level eslint config
const mainConfig = require("../../.eslintrc");
const typescriptConfig = require("../../eslint.config.typescript");

const {
  rules: tsRules,
  plugins: tsPlugins,
  settings: tsSettings,
} = typescriptConfig;
const {
  parserOptions: mainParserOptions,
  rules: mainRules,
  plugins: mainPlugins,
  settings: mainSettings,
} = mainConfig;

module.exports = {
  root: true,
  ...mainConfig,
  parserOptions: {
    ...mainParserOptions,
    project: "./tsconfig.eslint.json",
  },
  plugins: [...mainPlugins, ...tsPlugins],
  settings: { ...mainSettings, tsSettings },
  rules: { ...mainRules, ...tsRules },
};
