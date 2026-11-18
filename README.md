# Run Form Lab（仮称）

横から撮ったランニング動画を、ブラウザだけで **棒人間（スティックピクチャー）** に変換し、
**腰の上下動・オーバーストライド（股関節の真下に近い接地か）** を見えるようにする動作分析Webアプリ。

- スマホでもPCでも動く（ブラウザ完結・PWA）
- 動画は端末の外に出さない（サーバーへのアップロードなし）
- 過去の自分や別の選手との **2画面比較**、**PDF/画像レポート**
- 将来はランニング以外の動作分析にも拡張できる構成

## ドキュメント

| ファイル | 内容 |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Claude Code 向けの開発ルール（実装担当） |
| [AGENTS.md](AGENTS.md) | Codex 向けのルールとレビュー観点（レビュー担当） |
| [docs/spec.md](docs/spec.md) | 要件・画面・技術構成 |
| [docs/metrics.md](docs/metrics.md) | 指標の定義と計算方法 |
| [docs/filming-guide.md](docs/filming-guide.md) | 撮影ガイド（アプリ内表示の元原稿） |
| [docs/research.md](docs/research.md) | 根拠となる論文のまとめ |
| [docs/roadmap.md](docs/roadmap.md) | フェーズ別のタスク（GitHub Issue の元） |
| [docs/workflow.md](docs/workflow.md) | Claude Code × Codex × GitHub の進め方 |

## 開発コマンド（Phase 0 完了後）

```bash
npm install
npm run dev        # 開発サーバー
npm run test       # 単体テスト
npm run lint       # ESLint
npm run typecheck  # 型チェック
npm run build      # 本番ビルド
```

- 開発サーバーの URL は `http://localhost:5173/run-form-lab/`（公開時と同じパス）。
- 公開 URL：https://keitanakazono.github.io/run-form-lab/ （main へのマージで自動デプロイ）
