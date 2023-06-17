class User {

    constructor(userId, data) {
        this.id = userId;
        if (data != null) {
            this.update(data);
        }
    }

    update(data) {
        this.name = data.name;
    }

    getOpenData() {
        return {
            name : this.name
        };
    }
}

module.exports = User;