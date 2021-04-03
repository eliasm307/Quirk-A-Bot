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
    "preact",
    "plugin:jsx-a11y/recommended",
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
    ecmaVersion: 2019,
  },
  // for rules, 0 means ignore, 1 means warn, and 2 means error
  rules: {
    "@typescript-eslint/await-thenable": 0,
    "@typescript-eslint/comma-dangle": 0,
    "@typescript-eslint/dot-notation": 1,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/indent": 1,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-extra-semi": 0,
    "@typescript-eslint/no-floating-promises": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unsafe-assignment": 0,
    "@typescript-eslint/no-unsafe-assignment": 1,
    "@typescript-eslint/no-unsafe-call": 1,
    "@typescript-eslint/no-unsafe-member-access": 1,
    "@typescript-eslint/no-unsafe-return": 1,
    "@typescript-eslint/no-unused-expressions": 1,
    "@typescript-eslint/no-unused-vars": 1,
    "@typescript-eslint/no-use-before-define": 1,
    "@typescript-eslint/no-var-requires": 1,
    "@typescript-eslint/quotes": 0,
    "@typescript-eslint/restrict-plus-operands": 1,
    "@typescript-eslint/restrict-template-expressions": 1,
    "@typescript-eslint/semi": 0,
    "@typescript-eslint/space-before-function-paren": 0,
    "@typescript-eslint/naming-convention": [
      1,
      {
        selector: "interface",
        custom: {
          regex: "^i?[A-Z]",
          match: true,
        },
      },
    ],
    "array-bracket-spacing": 0,
    "arrow-body-style": 0,
    "arrow-parens": 0,
    "class-methods-use-this": 0,
    "comma-dangle": 0,
    "consistent-return": 0,
    "consistent-return": 0,
    "eol-last": 1,
    "func-names": 0,
    "function-paren-newline": 0,
    "global-require": 0,
    "import/extensions": [0, "never"],
    "import/extensions": 0,
    "import/no-dynamic-require": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-webpack-loader-syntax": 1,
    "import/prefer-default-export": 0,
    "import/prefer-default-export": 1,
    "jsx-a11y/anchor-is-valid": 1,
    "jsx-a11y/click-events-have-key-events": 1,
    "jsx-a11y/media-has-caption": 1,
    "linebreak-style": 0,
    "max-len": 0,
    "no-alert": 1,
    "no-case-declarations": 0,
    "no-console": 0,
    "no-constant-condition": 0,
    "no-irregular-whitespace": 0,
    "no-multiple-empty-lines": 0,
    "no-param-reassign": 1,
    "no-plusplus": 0,
    "no-restricted-globals": 0,
    "no-tabs": 0,
    "no-underscore-dangle": 0,
    "no-unreachable": 1,
    "no-unused-vars": 1,
    "no-use-before-define": 0,
    "no-void": 0,
    "nonblock-statement-body-position": 0,
    "object-curly-newline": 0,
    "object-curly-spacing": 0,
    "prefer-arrow-callback": 0,
    "prefer-destructuring": 0,
    "prefer-promise-reject-errors": 0,
    "prefer-template": 0,
    "react-hooks/exhaustive-deps": 2,
    "react-hooks/rules-of-hooks": 2,
    "react/forbid-prop-types": 0,
    "react/jsx-boolean-value": 1,
    "react/jsx-filename-extension": 0,
    "react/jsx-indent-props": 0,
    "react/jsx-no-bind": 2,
    "react/jsx-one-expression-per-line": 0,
    "react/jsx-props-no-spreading": 0,
    "react/no-danger": 1,
    "react/prefer-stateless-function": 1,
    "react/prop-types": 0,
    "react/react-in-jsx-scope": 0,
    "react/require-default-props": 0,
    "space-before-function-paren": 0,
    "space-in-parens": 0,
    "spaced-comment": 0,
    curly: 0,
    indent: 0,
    quotes: 0,
    radix: 0,
    semi: 0,
    "import/no-cycle": [
      1,
      {
        maxDepth: 5,
      },
    ],
    "no-console": [
      1,
      {
        allow: ["warn", "error"],
      },
    ],
    "spaced-comment": [
      "warn",
      "always",
      {
        exceptions: ["-", "+", "/"],
      },
    ],
  },
};
