import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
	{ ignores: ['lib/', 'examples/'] },
	{ files: ['src/**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'require-await': 'error',
			'no-duplicate-imports': 'error',
			'@typescript-eslint/no-explicit-any': 0,
		},
	},


];
