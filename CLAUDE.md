# CLAUDE.md — Claude Code 向け開発ルール

あなた（Claude Code）は **実装担当**。レビューは Codex が GitHub の PR 上で行う。

## プロジェクト概要

横から撮ったランニング動画をブラウザ内で棒人間に変換し、**腰の上下動** と
**着地位置（股関節の真下に近い接地か）** を見せる Web アプリ。スマホ・PC 両対応の PWA。
詳細は必ず以下を読んでから作業すること：

- 要件・技術構成：@docs/spec.md
- 指標の定義：@docs/metrics.md
- タスク一覧：@docs/roadmap.md
- 根拠の論文：docs/research.md（指標を変えるときだけ参照）
- 撮影ガイド：docs/filming-guide.md

## 絶対に守ること

1. **動画・関節データを外部に送らない。** `fetch` / `XMLHttpRequest` / `navigator.sendBeacon` / WebSocket / 外部スクリプトの読み込みを追加しない。アクセス解析も入れない。モデル・wasm は `public/` から読む。
2. **実在の人物の動画・画像をリポジトリに入れない。** テストは合成データ（`tests/fixtures/`）で行う。`*.mp4` `*.mov` は `.gitignore` 済み。
3. **指標の計算は純粋関数にし、単体テストを書く。** 定義は docs/metrics.md に従う。定義を変えるときは同じ PR で metrics.md も更新する。
4. **合否判定・点数・「良い/悪い」の表示を追加しない**（MVP の方針。spec.md §3, metrics.md §6）。
5. 時間は **実時間（秒）** で扱う。フレーム番号で時間を計算しない（`captureFps` を使う）。

## 進め方

- 1 Issue = 1 ブランチ（`feat/1-2-pose-worker` のように）= 1 PR。main へ直接 push しない。
- 作業開始時：roadmap.md の該当タスクと完了条件を確認 → 計画を短く書く → 実装。
- PR を出す前に必ず実行して通すこと：
  ```bash
  npm run lint && npm run typecheck && npm run test && npm run build
  ```
- PR 本文は `.github/pull_request_template.md` に沿って書く（何を・なぜ・確認方法・スクリーンショット）。
- PR を作ったら、PR のコメント欄（Conversation）に `@codex review` を投稿してレビューを依頼する。PR 本文に書くだけでは依頼した扱いにしない（自動レビューが起動した場合は追加投稿不要）。
- Codex の指摘は P0/P1 を必ず修正。P2 以下は対応するか、理由を返信する。
- 完了したら roadmap.md のチェックボックスを更新する。

## コーディング規約

- TypeScript strict。`any` 禁止（やむを得ない場合は理由をコメント）。
- 関数・変数名は英語、UI 文言は日本語で `src/i18n/ja.ts` にまとめる。コメントは日本語可。
- 座標・単位を型や名前で明示する（`xPx`, `heightCm`, `tSec`, `angleDeg`）。
- 画像座標は y 下向き。前方距離は進行方向 `dir` を掛けて「前が正」にそろえる。
- 重い処理（姿勢推定、全フレームの計算）は Web Worker で行い、UI スレッドを止めない。
- 依存ライブラリを追加するときは、PR に理由とライセンスを書く。

## よく使うコマンド

```bash
npm run dev        # 開発サーバー（スマホ実機確認は --host を付けて同じ Wi-Fi から）
npm run test       # Vitest
npm run lint
npm run typecheck
npm run build
```

## わからないとき

仕様に書かれていない判断が必要になったら、実装を止めて質問する（推測で仕様を増やさない）。
仕様の追加・変更が決まったら docs/spec.md の「未決事項」を更新する。
