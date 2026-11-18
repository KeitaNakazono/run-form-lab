// UI 文言はすべてここにまとめる（将来の多言語化に備える）
export const ja = {
  app: {
    title: 'Run Form Lab',
    tagline: '横から撮ったランニング動画を棒人間にして、腰の上下動と着地位置を見える化します。',
    preparing: '準備中です。',
  },
  analyses: {
    running: {
      label: 'ランニング（横から）',
    },
  },
} as const;

export type Messages = typeof ja;
