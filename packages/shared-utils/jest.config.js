module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: false,
	modulePathIgnorePatterns: ['\\/dist\\/', '\\/node_modules\\/', '\\/coverage\\/'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
};
