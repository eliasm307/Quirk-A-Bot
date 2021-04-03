// see top level eslint config
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [],
  plugins: ["@typescript-eslint", "react-hooks"],
  parserOptions: {
    project: "./tsconfig.eslint.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
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
  rules: {},
};
