// extend top level eslint config
// const mainConfig = require("../../.eslintrc");
const tsConfig = require("../../eslint.config.typescript");

/*
const { rules: tsRules, plugins: tsPlugins, settings: tsSettings } = tsConfig;
const {
  parserOptions: mainParserOptions,
  rules: mainRules,
  plugins: mainPlugins,
  settings: mainSettings,
} = mainConfig;
*/

// console.log(__filename, `Resulting ESlint config`, tsConfig);

module.exports = { ...tsConfig, root: true };
/*
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
*/
