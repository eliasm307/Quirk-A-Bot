// ? is this required?
module.exports = {
	presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
	env: {
		production: {
			plugins: ['transform-es2015-modules-commonjs'],
		},
		test: {
			plugins: ['transform-es2015-modules-commonjs'],
		},
	},
	/*transform: {
		'^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  
	},*/
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'^@quirk-a-bot/(.+)': '../../packages/\\1/src',
				},
			},
		],
	],
};
