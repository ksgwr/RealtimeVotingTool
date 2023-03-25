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

* 投票選択状態がリロード時に保持されず複数投票可能(だが、システム的にはuserId管理なのでId変わらなければ1票になるはず)

## Roadmap (TODO)

* Open Results画面の作成
DialogのURLをrouterで表現する
https://dev.to/berniwittmann/handling-dialogs-with-vue-router-29ji

* History画面の作成
* ルール詳細画面の作成
* デザインの修正
* ユーザーIDをローカルストレージに移行

-- v1 --

* 抽選モードの作成

-- v2 --

* 表示形式の変更
* 鍵モードの作成
* ルールに制限時間モード作成
* 画像カードの対応
* Template機能の作成
* 多言語対応