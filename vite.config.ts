import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// GitHub Pages 用の base 設定は Issue [0-2] で行う
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
  },
});
