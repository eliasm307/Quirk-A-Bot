// see top level eslint config
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "airbnb",
    "airbnb-typescript",
    "prettier",
    "prettier/react",
    "plugin:import/typescript",
  ],
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
  rules: {
    "no-unused-vars": 1,
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/explicit-function-return-type": 0,
  },
};
