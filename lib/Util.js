const crypto = require("crypto");

class Util {

    static issueUserId() {
        const N = 32;
        return crypto.randomBytes(N).toString('base64').substring(0, N);
    }

    static getRoomId(refererUrl) {
        return refererUrl.substring(refererUrl.lastIndexOf("/room/")+6);
    }

}

module.exports = Util;