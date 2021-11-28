const User = require('./User.js');

const ROOMS = {};

// TODO: ScaleUpするにはDBに書き換える必要あり
class Room {

    constructor(roomId) {
        this.roomId = roomId;
        this.users = {};
        this.edit = true;
        this.items = [
            { index: 0, text:'1' },
            { index: 1, text:'2' },
            { index: 2, text:'3' }
        ];
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
            edit : this.edit,
            items : this.items
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
}

module.exports = Room;