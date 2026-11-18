# 進め方：Claude Code（実装）× Codex（レビュー）× GitHub

```
roadmap.md ─▶ GitHub Issue ─▶ Claude Code がブランチで実装 ─▶ PR
                                                          │
                       CI（lint / 型 / テスト / ビルド）◀──┤
                       Codex レビュー（AGENTS.md の観点）◀──┘
                                       │
                   指摘を Claude Code が修正 ─▶ あなたが確認してマージ ─▶ GitHub Pages に自動公開
```

## 初回セットアップ（1回だけ）

1. **このフォルダを PC の作業場所に置く**（例：`~/dev/run-form-lab`）。
2. **GitHub にリポジトリを作る**（未成年の映像を扱う可能性があるので最初は **Private** 推奨）。
   ```bash
   cd ~/dev/run-form-lab
   git init && git add . && git commit -m "docs: 初期仕様"
   gh repo create run-form-lab --private --source=. --push
   ```
3. **Codex のコードレビューを有効にする**
   - Codex cloud にログインし、GitHub を接続してこのリポジトリを選ぶ。
   - Codex の設定でこのリポジトリのコードレビューを ON。
   - 「自動レビュー（Automatic reviews）」を ON にすると、設定したトリガーで自動レビューされる。手動で依頼する場合は PR のコメント欄（Conversation）に `@codex review` を投稿する。PR 本文に書くだけでは依頼した扱いにしない。
   - 既存 PR はコメントでレビューを依頼し、Codex の 👀 リアクションとレビュー結果を確認する。公式手順：https://learn.chatgpt.com/docs/third-party/github
   - レビューの観点はルートの `AGENTS.md` の「Review guidelines」に書いてある。
4. **GitHub Pages**：Settings → Pages → Source を「GitHub Actions」に（Phase 0-2 で Claude Code がデプロイ用 workflow を追加する）。
5. **ブランチ保護（推奨）**：Settings → Branches → main に「PR 必須」「CI 必須」。

## Claude Code への最初の指示（コピーして使う）

### ① Issue をまとめて作る

```
docs/roadmap.md の Phase 0〜3 のタスクを、.github/ISSUE_TEMPLATE/task.md の形式で
GitHub Issue にしてください（gh コマンドを使用）。タイトルは「[0-1] プロジェクト作成」の形式。
作成前に一覧を見せて確認を取ってください。
```

### ② Phase 0 を始める

```
CLAUDE.md と docs/spec.md を読んで、Issue [0-1] を実装してください。
ブランチを切り、完了条件を満たしたら PR を作成し、PR のコメント欄に @codex review を投稿してください（自動レビューが起動した場合は追加投稿不要）。
```

### ③ 以降の各タスク

```
Issue [1-2] を実装してください。始める前に計画を3〜5行で見せてください。
```

### ④ Codex の指摘を直す

```
PR #◯ の Codex のレビューコメントを読んで、P0/P1 を修正してください。
P2 以下は対応するか、理由を返信してください。
```

## あなた（人間）が確認すること

- スマホ実機で動くか（`npm run dev -- --host` で同じ Wi-Fi から、または公開 URL で）。
- 自分で撮ったグラウンド動画で、接地のフレームと垂線が「目で見て」合っているか。
- 指標の見せ方が指導で使える形か → 気づきは Issue にして Claude Code に渡す。

## 実データの扱い

- 実際の選手の動画は **リポジトリの外**（例：`~/Movies/run-form-samples/`）に置く。`samples/` `private/` は `.gitignore` 済み。
- Claude Code に実動画での確認をさせるときも、動画をコミットさせない。
