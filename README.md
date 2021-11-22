# RealtimeVotingTool

数人規模のチームで投票・抽選を支援するためのWebToolです。
フォームでのアンケート方式と異なり、ホストも投票に公平に参加できリアルタイムで即時投票から開票までを確認できるツールを目指します。

## How to develop

### Test

```
$ npm run test
```

### Test Run

```
$ npx node index.js
$ open http://localhost:3000/
```

### Deploy to heroku

```
$ heroku login
$ sh deploy.sh
```