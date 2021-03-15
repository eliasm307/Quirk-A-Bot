module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	verbose: false,
	modulePathIgnorePatterns: ['\\/dist\\/', '\\/node_modules\\/', '\\/coverage\\/', '\\/dist\\/index\\.js'],
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
};
