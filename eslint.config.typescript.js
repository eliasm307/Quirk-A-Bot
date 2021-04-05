/** Extends main config for js to apply to ts */

const mainConfig = require("./.eslintrc");

const {
  parserOptions: mainParserOptions,
  rules: mainRules,
  plugins: mainPlugins,
  settings: mainSettings,
  extends: mainExtends,
} = mainConfig;

module.exports = {
  ...mainConfig,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ...mainParserOptions,
    project: "./tsconfig.eslint.json",
  },

  plugins: [...mainPlugins, "@typescript-eslint"],
  extends: [
    ...mainExtends,
    "airbnb-typescript",
    "plugin:import/typescript",
    // "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  settings: {
    ...mainSettings,
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
      "babel-module": {
        root: ["./"],
      },
      // typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  // for rules, 0 means ignore, 1 means warn, and 2 means error
  rules: {
    ...mainRules,
    "@typescript-eslint/await-thenable": 0,
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/dot-notation": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/indent": 0, // managed by code formatter
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/lines-between-class-members": 0,
    "@typescript-eslint/no-extra-semi": 1,
    "@typescript-eslint/no-floating-promises": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-unsafe-call": 1,
    "@typescript-eslint/no-unsafe-member-access": 1,
    "@typescript-eslint/no-unsafe-return": 1,
    "@typescript-eslint/no-unused-expressions": 1,
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/no-use-before-define": 1,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/restrict-plus-operands": 1,
    "@typescript-eslint/restrict-template-expressions": 1,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/space-before-function-paren": 0,
    "@typescript-eslint/naming-convention": [
      1,
      {
        selector: "interface",
        format: ["PascalCase", "strictCamelCase"],
        custom: {
          regex: "^i?[A-Z]",
          match: true,
        },
      },
    ],
  },
};
