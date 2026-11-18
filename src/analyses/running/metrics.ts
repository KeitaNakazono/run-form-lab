import type { PoseSequence } from '../../core/pose';
import type { RunningSettings } from './settings';

// 指標計算（純粋関数）。docs/metrics.md §3, §4 に従い roadmap 3-1〜3-3 で実装する。

/** ランニング解析の結果。指標を実装するタスクでフィールドを追加する */
export type RunningResult = Record<string, never>;

export function analyzeRunning(_input: PoseSequence, _settings: RunningSettings): RunningResult {
  return {};
}
