// see top level eslint config
module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['preact', 'plugin:@typescript-eslint/recommended'],
	rules: {
		'no-unused-vars': 0,
		'@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/explicit-function-return-type': 0
	},
};
