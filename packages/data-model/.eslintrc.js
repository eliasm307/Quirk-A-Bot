// extend top level eslint config
const tsConfig = require("../../eslint.config.typescript");

const { parserOptions: tsParserOptions, settings: tsSettings } = tsConfig;

module.exports = {
  ...tsConfig,
  parserOptions: {
    ...tsParserOptions,
    project: "./tsconfig.eslint.json",
    tsconfigRootDir: __dirname,
  },
  settings: {
    ...tsSettings,
    /*
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      "babel-module": {
        root: ["./"],
      },
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
    */
  },
  root: true,
};
