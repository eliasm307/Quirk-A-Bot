// extend top level eslint config
const mainConfig = require("../../.eslintrc");

module.exports = {
  ...mainConfig,
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      "babel-module": {
        root: ["./"],
      },
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
};
