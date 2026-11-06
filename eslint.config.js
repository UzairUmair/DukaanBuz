import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

const languageOptions = {
  ecmaVersion: 2022,
  globals: globals.browser,
  parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' },
};

export default [
  { ignores: ['dist', '.agents', '.claude', 'node_modules'] },
  {
    ...js.configs.recommended,
    files: ['src/**/*.js', '*.js'],
    languageOptions,
    rules: { ...js.configs.recommended.rules, 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] },
  },
  {
    files: ['src/**/*.jsx'],
    languageOptions,
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...reactRefresh.configs.vite.rules,
      'no-unused-vars': 'off',
    },
  },
];
