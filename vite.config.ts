import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// GitHub Pages はリポジトリ名のサブパス（https://<user>.github.io/run-form-lab/）で公開する。
// 開発サーバーも同じパスにそろえ、本番とのパス違いによる不具合を防ぐ。
export default defineConfig({
  base: '/run-form-lab/',
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
});
