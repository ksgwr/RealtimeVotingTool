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
        // {secretId => User Object}
        this.users = {};
        // {roomOpenUserId => User Object}
        this.openUsers = {};
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

        console.log('counting result');
        console.log(JSON.stringify(this.openUsers));
        console.log(JSON.stringify(results));
        for (const [index, votes] of Object.entries(results)) {
            for (let i=0;i<votes.length;i++) {
                const vote = votes[i];
                if (vote.userId !== undefined) {
                    Object.assign(results[index][i], this.openUsers[vote.userId]);
                }
            }
        }

        console.log("summary results");
        console.log(JSON.stringify(results));

        for (let i=0;i<items.length;i++) {
            if (items[i].index in results) {
                items[i].results = results[items[i].index];
            }
        }

        this.histories.push({
           id : this.histories.length + 1,
           items : items,
           rules : this.vote.getRules()
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

    setNextModeIfNeeded() {
        if (this.mode == MODE.RESULT) {
            this.mode = MODE.BEFORE_VOTE;
        }
    }

    getInitialData() {
        return {
            users : this.openUsers,
            mode : this.mode,
            items : this.items,
            votes : this.getOnGoingResult(),
            rules : this.vote.getRules(),
            voteId : this.histories.length + 1
        };
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
        const openUid = this.getRoomOpenUserId(userId);
        if (data === null) {
            delete this.openUsers[openUid];
        } else {
            this.openUsers[openUid] = target.getOpenData();
        }
        return this.openUsers;
    }

    updateVotingRule(data) {
        return this.vote.updateVotingRule(data);
    }

    updateVoteMax(data) {
        return this.vote.updateVoteMax(data);
    }

    updateMinOpenable(data) {
        return this.vote.updateMinOpenable(data);
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

    getRoomOpenUserId(userId) {
        const res = Util.hash(userId + SALT + this.roomId);
        console.log(`userId:${userId} roomId:${this.roomId} res:${res}`);
        return res;
    }

    voteOk(userId, itemIndexes) {
        const uid = this.getRoomOpenUserId(userId);
        this.vote.vote(uid, itemIndexes);
    }

    voteCancel(userId) {
        const uid = this.getRoomOpenUserId(userId);
        this.vote.cancel(uid);
    }

    getOnGoingResult() {
        const ret = this.vote.getOnGoingResult();
        if (ret.openId) {
            for (const [index, votes] of Object.entries(ret.results)) {
                for (let i=0;i<votes.length;i++) {
                    const vote = votes[i];
                    if (vote.userId !== undefined) {
                        Object.assign(ret.results[index][i], this.openUsers[vote.userId]);
                    }
                }
            }
        }
        return ret
    }

    getResults() {
        return this.histories;
    }
}

module.exports = Room;