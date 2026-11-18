// 姿勢推定の結果を表す型（動作の種類に依存しない）
// 座標系は docs/metrics.md §0：画像座標 px、x 右向き・y 下向き。

/** 1 つの関節点。推定できなかった点は PoseFrame 側で null にする。 */
export interface Landmark {
  xPx: number;
  yPx: number;
  /** 0〜1。MediaPipe の visibility。低い点は欠損として扱う（metrics.md §1） */
  visibility: number;
}

/** 1 フレーム分の関節点。 */
export interface PoseFrame {
  /** 動画の先頭からの実時間（秒）。フレーム番号から時間を計算しないこと */
  tSec: number;
  /** MediaPipe Pose Landmarker の 33 点（index は POSE_LANDMARK）。人が検出されなければ null */
  landmarks: readonly (Landmark | null)[] | null;
}

/** 1 本の動画から得た関節点の時系列。解析モジュールへの入力。 */
export interface PoseSequence {
  /** 撮影時の fps（スロー動画の補正後）。時間計算はこれを使う */
  captureFps: number;
  frameWidthPx: number;
  frameHeightPx: number;
  frames: readonly PoseFrame[];
}

/** 使用する関節点の index（metrics.md §0 の表） */
export const POSE_LANDMARK = {
  leftShoulder: 11,
  rightShoulder: 12,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  leftHeel: 29,
  rightHeel: 30,
  leftFootIndex: 31,
  rightFootIndex: 32,
} as const;

export type PoseLandmarkName = keyof typeof POSE_LANDMARK;
