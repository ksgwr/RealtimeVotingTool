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
