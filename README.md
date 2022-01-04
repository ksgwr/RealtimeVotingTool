# RealtimeVotingTool ![build status](https://github.com/ksgwr/RealtimeVotingTool/actions/workflows/main.yml/badge.svg)

数人規模のチームで投票・抽選を支援するためのWebToolです。
フォームでのアンケート方式と異なり、ホストも投票に公平に参加できリアルタイムで即時投票から開票までを確認できるツールを目指します。

## Demo

https://realtime-voting-tool.herokuapp.com/

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

### Deploy to heroku

once setting

```
$ heroku login
$ heroku config:set NPM_CONFIG_PRODUCTION=false
```

```
$ sh deploy.sh
```

## Debug Tips (Memo)

in Chrome Console

```
$vm.data
```

## Bugs

* 投票選択状態がリロード時に保持されず複数投票可能(だが、システム的にはuserId管理なのでId変わらなければ1票になるはず)

-    "core-js": "^3.6.5",
-    "express": "^4.17.1",
+    "core-js": "^3.20.1",
+    "express": "^4.17.2",
     "roboto-fontface": "*",
     "socket.io": "^4.4.0",
     "socket.io-client": "^4.4.0",
-    "vue": "^3.0.0",
+    "vue": "^3.2.26",
