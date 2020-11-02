module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true
	},
	globals: {
		StatusBar: 'readonly',
		device: 'readonly'
	},
	parserOptions: {
		parser: 'babel-eslint'
	},
	extends: ['calltek', 'calltek/vue'],
	rules: {},
	settings: {
		'import/resolver': {
			alias: {
				extensions: ['.js']
			}
		}
	}
};
