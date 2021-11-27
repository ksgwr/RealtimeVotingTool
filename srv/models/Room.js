const User = require('./User.js');

const ROOMS = {};

// TODO: ScaleUpするにはDBに書き換える必要あり
class Room {

    constructor(roomId) {
        this.roomId = roomId;
        this.users = {};
        this.edit = true;
        //this.vote = new Vote();
    }

    static getOrCreateRoom(roomId) {
        let room = ROOMS[roomId];
        if (room === undefined) {
            room = new Room(roomId);
            ROOMS[roomId] = room;
        }
        return room;
    }

    getInitialData() {
        return {
            users : this.getUsers(),
            edit : this.edit
        };
    }

    getUsers() {
        return Object.values(this.users);
    }

    updateUser(userId, data) {
        let target = this.users[userId];
        if (target === undefined) {
            target = new User(userId, data);
            this.users[userId] = target;
        } else if (data === null) {
            delete this.users[userId];
        } else {
            target.update(data);
        }
        return Object.values(this.users);
    }

}

module.exports = Room;