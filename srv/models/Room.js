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
    }

    static getOrCreateRoom(roomId) {
        let room = ROOMS[roomId];
        if (room === undefined) {
            room = new Room(roomId);
            ROOMS[roomId] = room;
        }
        return room;
    }

    setMode(mode) {
        this.mode = mode;
        if (mode == MODE.VOTE_START) {
            this.vote.initVote();
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
            rules : this.vote.getRules()
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
}

module.exports = Room;