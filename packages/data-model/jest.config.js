/* eslint-disable import/no-extraneous-dependencies */
const { pathsToModuleNameMapper } = require("ts-jest/utils");
// Load the config which holds the path aliases.
const { compilerOptions } = require("../../tsconfig.json");
const { compilerOptions: compilerOptionsLocal } = require("./tsconfig.json");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: false,
  modulePathIgnorePatterns: [
    "\\/dist\\/",
    "\\/node_modules\\/",
    "\\/coverage\\/",
    // "\\/src/index\\/", // ignore main index file for test coverage
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  // transformIgnorePatterns: ['packages/shared-utils/(?!(dist)/)'],
  // transformIgnorePatterns: ["rxjs/dist/cjs"],
  moduleNameMapper: pathsToModuleNameMapper(
    { ...compilerOptions.paths },
    {
      // This has to match the baseUrl defined in tsconfig.json.
      prefix: "<rootDir>/../../",
    }
  ),
};
