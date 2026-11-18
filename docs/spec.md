# 仕様書

## 1. 目的

横から撮影したランニング動画から、**腰の上下動** と **着地位置（股関節の真下に近い接地か）** を
誰でも目で確認できるようにし、フォーム改善の前後比較に使う。

## 2. 利用者・利用場面

- 利用者：運動指導者（開発者本人）、および指導を受ける選手。
- 対象：健康的に走れる全年代。小学生・中高年への提供範囲は未定 → **未成年の映像を扱う前提で設計する**（§6）。
- 場面：主に **グラウンド（トラック）** で撮影 → その場でスマホで確認 → 後でPCで比較・レポート作成。
- 将来：ランニング以外の動作分析（姿勢、ジャンプ、歩行など）にも使う → **解析モジュールを差し替えられる構成**（§5.3）。

## 3. 機能要件

### MVP

| # | 機能 | 内容 |
|---|---|---|
| F1 | 動画の読み込み | 端末内の動画ファイルを選択（mp4 / mov）。撮影 fps の確認・修正 |
| F2 | 姿勢推定 | ブラウザ内で MediaPipe Pose Landmarker を実行し、全フレームの関節位置を取得 |
| F3 | 棒人間表示 | ①実映像＋棒人間の重ね表示 ②棒人間のみ（背景単色）を切替。コマ送り・スロー再生・指定フレームで静止 |
| F4 | スケール・地面設定 | コーン2点タップで px→cm。地面ラインの自動推定と手動調整 |
| F5 | 接地・離地の検出 | 自動検出＋タイムライン上で手動修正 |
| F6 | 指標表示 | 腰の上下動（軌跡＋数値）、着地位置（垂線＋距離）、下腿角度、ピッチ、体幹前傾。定義は [metrics.md](metrics.md) |
| F7 | 保存 | 選手ごと・日付ごとにセッションを端末内（IndexedDB）に保存。動画本体は保存するか選べる |
| F8 | 2画面比較 | 過去の自分／別の選手と並べて同期再生。棒人間の重ね合わせ。数値の差分 |
| F9 | レポート | 画像（PNG）と PDF。内容：選手名・日付・撮影条件、接地時の静止画（垂線つき）、腰の軌跡グラフ、指標表、メモ欄 |
| F10 | 撮影ガイド | [filming-guide.md](filming-guide.md) をアプリ内で表示。読み込み時に fps・全身が写っているか等を自動チェックして注意を出す |

### MVP 後

- 棒人間つき動画の書き出し（MediaRecorder）
- アプリ内での撮影（getUserMedia、ただし高 fps はブラウザ側の制約が大きいので要検証）
- データの書き出し／読み込み（JSON、端末間の移動用）
- 他の動作分析モジュール

## 4. 非機能要件

- **ブラウザ完結**：動画・関節データを外部サーバーへ送らない。アクセス解析ツールも入れない。
- **対応環境**：iPhone Safari（最新2版）、Android Chrome、PC Chrome / Edge / Safari。
- **オフライン動作**：PWA。モデルファイル・wasm は自前でホストしキャッシュする（CDN 依存にしない）。
- **性能目標**：240fps × 3 秒（約 720 フレーム）をミドルクラスのスマホで 1 分以内に解析。進捗バーとキャンセル。
- **UI 言語**：日本語（文言は一か所にまとめ、将来の多言語化に備える）。
- **画面**：スマホ縦持ちで操作でき、PC では2画面比較を横並び。

## 5. 技術構成

### 5.1 スタック

| 用途 | 採用 | 理由 |
|---|---|---|
| 言語 | TypeScript | 型で指標計算のミスを減らす。Claude Code / Codex と相性が良い |
| ビルド | Vite | 軽量・高速 |
| UI | React | 情報量・作例が多い |
| 状態管理 | Zustand | 小さく単純 |
| 姿勢推定 | `@mediapipe/tasks-vision` の PoseLandmarker（`runningMode: "VIDEO"`） | ブラウザ内で動作、踵・つま先の点がある、Apache-2.0 |
| 解析の実行場所 | Web Worker（可能なら OffscreenCanvas） | UI を固めない |
| 描画 | Canvas 2D | 棒人間・垂線・軌跡 |
| グラフ | uPlot（軽量）または Recharts | 時系列1〜2本程度なので軽いもの |
| 保存 | IndexedDB（Dexie） | 動画 Blob と関節データを端末内に |
| PWA | vite-plugin-pwa | オフライン・ホーム画面追加 |
| レポート | HTML レイアウト → 印刷用 CSS で PDF（`window.print()`）、PNG は html-to-image | jsPDF は日本語フォント埋め込みが重いので避ける |
| テスト | Vitest（単体）、Playwright（E2E, 後半） | |
| 品質 | ESLint、Prettier、`tsc --noEmit` | |
| 公開 | GitHub Pages（GitHub Actions でデプロイ） | HTTPS 必須（PWA） |

### 5.2 フレーム取得の方針

- Phase 1：`<video>` を 1 フレームずつシークして `requestVideoFrameCallback` で実際の表示時刻を取得 → `detectForVideo(video, timestampMs)`。
- 課題が出たら：WebCodecs ＋ mp4 デマルチプレクサ（mp4box.js 等）でフレームを正確にデコード。
- **リスク**：iPhone の HEVC（.mov）が PC の Chrome で再生できない場合がある → 読み込み時に判定して「互換性優先（H.264）で撮影／書き出し」を案内。

### 5.3 ディレクトリ構成（案）

```
src/
  core/                 # 動作の種類に依存しない部分
    video/              # 動画読み込み・フレーム取得・fps 判定
    pose/               # PoseLandmarker ラッパー（Worker）、landmark 型
    signal/             # 補間・Butterworth フィルタ・微分
    geometry/           # 角度・距離・直線フィット（RANSAC）
    calibration/        # px→cm、地面ライン
    storage/            # Dexie スキーマ、選手・セッション
    render/             # 棒人間・垂線・軌跡の Canvas 描画
  analyses/
    running/            # ランニング解析モジュール
      events.ts         # IC / TO 検出
      metrics.ts        # 指標計算（純粋関数）
      views/            # ランニング用の表示部品
    index.ts            # AnalysisModule の登録
  features/
    import/  player/  compare/  report/  guide/  athletes/
  ui/                   # 共通 UI 部品
  i18n/ja.ts            # 文言
tests/
  fixtures/             # 合成 landmark データ（実写の人物データは置かない）
```

### 5.4 解析モジュールの共通インターフェース（拡張用）

```ts
interface AnalysisModule<Settings, Result> {
  id: string;                 // "running-sagittal"
  label: string;              // "ランニング（横から）"
  defaultSettings: Settings;
  analyze(input: PoseSequence, settings: Settings): Result;   // 純粋関数
  Overlay: React.FC<{ result: Result; frame: number }>;        // 映像上の描画
  Summary: React.FC<{ result: Result }>;                       // 数値・グラフ
  ReportSection: React.FC<{ result: Result }>;                 // レポート用
}
```

## 6. プライバシー・安全

- 映像と関節データは **端末内にのみ保存**。外部送信のコードを入れない（レビューで必ず確認）。
- 未成年の映像を扱う可能性がある：
  - 選手名はニックネーム／イニシャル入力を推奨する案内を出す。
  - レポートに顔を出さない「棒人間のみ」モードを用意する。
  - 撮影・利用について本人（未成年は保護者）の同意を取る旨をアプリ内に記載（同意の取得自体は運用で行う）。
- セッション・選手単位で削除できる。全データ削除ボタン。

## 7. 未決事項

- 小学生・中高年に提供するか、提供形態（自分だけ使う／選手にURLを渡す）。
- アプリ名・公開URL（GitHub Pages か独自ドメインか）。
- 着地位置・上下動に「目安の色分け」を付けるか（MVPでは付けない。自分の選手データが溜まってから検討）。
