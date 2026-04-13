# 逆ポートレート

スマホのポートレートモード（背景ボケ）の逆で、**前景の被写体をぼかして背景をシャープに保つ**Webアプリ。

完全クライアントサイドで動作し、画像はサーバに送信されません。

## 機能

- インカメラで写真を撮影、またはデバイスから画像を選択
- AIによる前景分離（[`@imgly/background-removal`](https://github.com/imgly/background-removal-js) 使用）
- 前景だけにぼかしを適用し、背景はシャープなまま合成
- 結果画像をJPEGで保存

## 使い方

1. 「写真を撮る」または「画像を選ぶ」でソース画像を用意
2. プレビューを確認してOKを押す
3. AIが前景を分離してぼかしを適用（初回はモデルのダウンロードに時間がかかります）
4. 結果を確認して「保存する」でダウンロード

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```

## デプロイ時の注意

ONNX RuntimeがSharedArrayBufferを必要とするため、以下のHTTPヘッダーが必要です。

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Vercelの場合は `vercel.json` を追加：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

## ライセンス

AGPL-3.0 — [`@imgly/background-removal`](https://github.com/imgly/background-removal-js) に合わせています。
