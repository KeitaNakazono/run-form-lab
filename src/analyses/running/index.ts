import { ja } from '../../i18n/ja';
import type { AnalysisModule } from '../types';
import { analyzeRunning, type RunningResult } from './metrics';
import { defaultRunningSettings, type RunningSettings } from './settings';

// 表示部品は roadmap 1-3, 3-1〜3-2, 5-1 で views/ に実装して差し替える
const renderNothing = () => null;

export const runningModule: AnalysisModule<RunningSettings, RunningResult> = {
  id: 'running-sagittal',
  label: ja.analyses.running.label,
  defaultSettings: defaultRunningSettings,
  analyze: analyzeRunning,
  Overlay: renderNothing,
  Summary: renderNothing,
  ReportSection: renderNothing,
};

export type { RunningResult, RunningSettings };
