import { describe, expect, it } from 'vitest';
import { ja } from './ja';

// テスト環境の動作確認を兼ねた最小のテスト
describe('ja messages', () => {
  it('has a non-empty app title and tagline', () => {
    expect(ja.app.title).toBe('Run Form Lab');
    expect(ja.app.tagline.length).toBeGreaterThan(0);
  });
});
