module.exports = {
	presets: ['preact-cli/babel', ['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
	plugins: [
		[
			'module-resolver',
			{
				alias: {
					'^@quirk-a-bot/(.+)': '../../../packages/\\1/src',
				},
			},
		],
	],
};
