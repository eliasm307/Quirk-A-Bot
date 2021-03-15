
// ? is this required, using cra-rewired instead
module.exports = {
	presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],

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
