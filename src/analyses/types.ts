import type { FC } from 'react';
import type { PoseSequence } from '../core/pose';

/**
 * 解析モジュールの共通インターフェース（docs/spec.md §5.4）。
 * ランニング以外の動作分析を追加するときは、これを実装して analyses/index.ts に登録する。
 */
export interface AnalysisModule<Settings, Result> {
  /** 例："running-sagittal"。保存データに残るので一度決めたら変えない */
  id: string;
  /** 画面に出す名前（src/i18n/ja.ts の文言を使う） */
  label: string;
  defaultSettings: Settings;
  /** 純粋関数。同じ入力からは必ず同じ結果を返す */
  analyze(input: PoseSequence, settings: Settings): Result;
  /** 映像上の描画 */
  Overlay: FC<{ result: Result; frame: number }>;
  /** 数値・グラフ */
  Summary: FC<{ result: Result }>;
  /** レポート用 */
  ReportSection: FC<{ result: Result }>;
}
