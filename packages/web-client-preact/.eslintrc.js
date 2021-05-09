// extend top level eslint config
const mainConfig = require("../../.eslintrc");

const {
  extends: mainExtends,
  parserOptions: mainParserOptions,
  settings: mainSettings,
  extends: mainExtends,
} = mainConfig;

module.exports = {
  ...mainConfig,
  parserOptions: {
    ...mainParserOptions,
    project: "./tsconfig.eslint.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    ...mainSettings,
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the version of React to use
    },
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
  extends: [...mainExtends, "preact"],
};
