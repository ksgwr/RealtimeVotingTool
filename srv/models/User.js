class User {

    constructor(userId, data) {
        this.id = userId;
        this.update(data);
    }

    update(data) {
        this.name = data.name;
    }
}

module.exports = User;