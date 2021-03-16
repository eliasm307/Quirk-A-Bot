/* eslint-disable import/no-extraneous-dependencies */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
// Load the config which holds the path aliases.
const { compilerOptions } = require('../../tsconfig.json');

module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: false,
	modulePathIgnorePatterns: ['\\/dist\\/', '\\/node_modules\\/', '\\/coverage\\/'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
	// transformIgnorePatterns: ['packages/shared-utils/(?!(dist)/)'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		// This has to match the baseUrl defined in tsconfig.json.
		prefix: '<rootDir>/../../',
	}),
};
