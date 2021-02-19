import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: false,
	modulePathIgnorePatterns: ['dist/.*\\.test\\.', 'node_modules', 'coverage'],
};
export default config;
