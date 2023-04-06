const Util = require('../lib/Util');
const User = require('./User');
const Vote = require('./Vote');

// TODO: ScaleUpするためには共通の鍵設定が必要
const SALT = Util.getSecret();

const ROOMS = {};
const MODE = {
    EDIT: 0,
    BEFORE_VOTE: 1,
    VOTE_START: 2,
    VOTING: 3,
    OPENABLE: 4,
    OPENABLE_WAITING: 5,
    RESULT: 6
};

// TODO: ScaleUpするにはDBに書き換える必要あり
class Room {

    constructor(roomId) {
        this.roomId = roomId;
        this.users = {};
        this.mode = MODE.EDIT;
        this.items = [
            { index: 0, text:'1' },
            { index: 1, text:'2' },
            { index: 2, text:'3' }
        ];
        this.vote = new Vote();
        this.histories = [];
    }

    static getOrCreateRoom(roomId) {
        let room = ROOMS[roomId];
        if (room === undefined) {
            room = new Room(roomId);
            ROOMS[roomId] = room;
        }
        return room;
    }

    countingResult() {
        let items = JSON.parse(JSON.stringify(this.items));
        let results = this.vote.getSummaryResult();

        console.log("summary results");
        console.log(JSON.stringify(results));

        for (let i=0;i<items.length;i++) {
            if (items[i].index in results) {
                items[i].results = results[items[i].index];
            }
        }

        this.histories.push({
           id : this.histories.length + 1,
           items : items
        });
    }

    setMode(mode) {
        this.mode = mode;
        if (mode == MODE.VOTE_START) {
            this.vote.initVote();
        } else if (mode == MODE.RESULT) {
            this.countingResult();
        }
    }

    getMode() {
        return this.mode;
    }

    getInitialData() {
        return {
            users : this.getUsers(),
            mode : this.mode,
            items : this.items,
            votes : this.getOnGoingResult(),
            rules : this.vote.getRules(),
            voteId : this.histories.length + 1
        };
    }

    getUsers() {
        return Object.values(this.users);
    }

    updateUser(userId, data) {
        const uid = Util.hash(userId + SALT);
        let target = this.users[uid];
        if (target === undefined) {
            target = new User(uid, data);
            this.users[uid] = target;
        } else if (data === null) {
            delete this.users[uid];
        } else {
            target.update(data);
        }
        return Object.values(this.users);
    }

    // add if true add item else delete last item 
    updateItemsSize(add) {
        if (add) {
            this.items.push(
                {
                    index: this.items.length,
                    text: '' + (this.items.length + 1)
                }
            )
        } else {
            if (this.items.length > 0) {
                this.items.pop();
            }
        }
        return this.items;
    }

    updateItemText(index, text) {
        if (index < 0 || this.items.length <= index) {
            return this.items;
        }
        this.items[index].text = text;
        return this.items;
    }

    voteOk(userId, itemIndexes) {
        const uid = Util.hash(userId + SALT);
        this.vote.vote(userId, itemIndexes);
    }

    voteCancel(userId) {
        const uid = Util.hash(userId + SALT);
        this.vote.cancel(userId);
    }

    getOnGoingResult() {
        return this.vote.getOnGoingResult();
    }

    getResults() {
        // TODO: 投票締め切りしてthis.historiesにデータを保存、ここからは単純にgetするだけにする
        // このクラス内でその時点のルールに従って結果の匿名化、抽象化などを行う
        //return [this.vote.getSummaryResult()];
        // dummy data
        
        return [
            {
                id:1,
                items:[
                    { index: 0, text:'1', results:[{userId:'aaa', rank:1}]},
                    { index: 1, text:'2', results:[{userId:'bbb', rank:1}, {userId:'ccc', rank:1}]},
                    { index: 2, text:'3' }
                ]
            },
            {
                id:2,
                items:[
                    { index:0, text:'1', results:[{rank:1}, {rank:1}]},
                    { index:1, text:'2'},
                    { index:2, text:'3'}
                ]
            }
        ];
        //return this.histories;
    }
}

module.exports = Room;