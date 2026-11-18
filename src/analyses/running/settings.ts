// ランニング解析の設定。初期値は docs/metrics.md に従う。
export interface RunningSettings {
  /** 平滑化（2次 Butterworth、ゼロ位相）のカットオフ周波数。metrics.md §1-2 */
  lowpassCutoffHz: number;
  /** 線形補間で埋める欠損の最大長。metrics.md §1-1 */
  maxInterpolatedGapFrames: number;
  /** これ未満の visibility の点は欠損扱い（奥側の脚の採用閾値）。metrics.md §0 */
  minVisibility: number;
  /** 接地判定の高さ閾値（脚長に対する比）。metrics.md §2 */
  contactHeightLegRatio: number;
  /** スケール設定に使うコーン 2 点間の既知距離。metrics.md §1-3 */
  coneDistanceCm: number;
}

export const defaultRunningSettings: RunningSettings = {
  lowpassCutoffHz: 6,
  maxInterpolatedGapFrames: 3,
  minVisibility: 0.6,
  contactHeightLegRatio: 0.02,
  coneDistanceCm: 200,
};
