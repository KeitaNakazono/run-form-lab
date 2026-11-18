import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 外部への通信を禁止する（CLAUDE.md「絶対に守ること」1 / AGENTS.md P0）
const networkMessage =
  '動画・関節データを端末の外に出さないため、外部通信 API は使わない（CLAUDE.md 参照）。';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.worker },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      // 未実装の関数などで引数を受け取るだけの場合は _ を付ける（tsc の noUnusedParameters と同じ扱い）
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: networkMessage },
        { name: 'XMLHttpRequest', message: networkMessage },
        { name: 'WebSocket', message: networkMessage },
        { name: 'EventSource', message: networkMessage },
      ],
      'no-restricted-properties': [
        'error',
        { object: 'navigator', property: 'sendBeacon', message: networkMessage },
        { object: 'window', property: 'fetch', message: networkMessage },
        { object: 'globalThis', property: 'fetch', message: networkMessage },
        { object: 'self', property: 'fetch', message: networkMessage },
      ],
    },
  },
  {
    files: ['vite.config.ts', 'eslint.config.js'],
    languageOptions: { globals: globals.node },
  },
  prettier,
);
