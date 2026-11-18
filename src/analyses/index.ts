import { runningModule } from './running';

// 解析モジュールの登録。新しい動作分析を追加するときはここに並べる。
// 配列のまま型を残すことで、any を使わずにモジュールごとの Settings / Result 型を保つ。
export const analysisModules = [runningModule] as const;

export type RegisteredAnalysisModule = (typeof analysisModules)[number];
export type AnalysisModuleId = RegisteredAnalysisModule['id'];

export function findAnalysisModule(id: string): RegisteredAnalysisModule | undefined {
  return analysisModules.find((module) => module.id === id);
}

export type { AnalysisModule } from './types';
