# RealtimeVotingTool ![build status](https://github.com/ksgwr/RealtimeVotingTool/actions/workflows/main.yml/badge.svg)

数人規模のチームで投票・抽選を支援するためのWebToolです。
フォームでのアンケート方式と異なり、ホストも投票に公平に参加できリアルタイムで即時投票から開票までを確認できるツールを目指します。

## Demo

https://realtime-voting-tool.onrender.com/

## How to develop

### Test

```
$ npm run test
```

### Test Run

```
$ npm run express
$ open http://localhost:3000/
```

```
$ npm run serve
$ open http://localhost:8080/room/abc
```

## Debug Tips (Memo)

in Chrome Console

```
$vm.data
```

## Bugs


## Roadmap (TODO)

* リアルタイム処理の実装(複数投票時のUserListの取得ができない)
* デザインの修正
-- v1 --

* 抽選モードの作成(backface-visibilityを使う)

-- v2 --

* 表示形式の変更
* 鍵モードの作成
* ルールに制限時間モード作成
* 画像カードの対応
* Template機能の作成
* 多言語対応
* historyの最大保存数
* 更新されていない部屋の自動削除