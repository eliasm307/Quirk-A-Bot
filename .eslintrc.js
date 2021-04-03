module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  ignorePatterns: [
    "**/lib/**/*", // Ignore built files.
    "**/build/**/*", // Ignore built files.
    "**/public/**/*", // Ignore built files.
    "**/node_modules/**/*", // Ignore built files.
  ],
  extends: [
    "eslint:recommended",
    "airbnb-base",
    // "preact",
    "plugin:@typescript-eslint/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2019,
  },
  // for rules, 0 means ignore, 1 means warn, and 2 means error
  rules: {
    "array-bracket-spacing": 0,
    "arrow-parens": 0,
    "comma-dangle": 0,
    "consistent-return": 0,
    "eol-last": 1,
    "import/extensions": 0,
    "import/prefer-default-export": 0,
    "linebreak-style": 0,
    "max-len": 0,
    "no-console": 0,
    "no-multiple-empty-lines": 0,
    "no-plusplus": 0,
    "no-tabs": 0,
    "no-unused-vars": 1,
    "nonblock-statement-body-position": 0,
    "object-curly-newline": 0,
    "space-before-function-paren": 0,
    "space-in-parens": 0,
    "spaced-comment": 0,
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/explicit-function-return-type": 0,
    curly: 0,
    indent: 0,
    quotes: 0,
    radix: 0,
  },
};
