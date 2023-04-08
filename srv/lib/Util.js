const crypto = require("crypto");

class Util {

    static getSecret() {
        const N = 8;
        return crypto.randomBytes(N).toString('base64').substring(0, N);
    }

    static hash(str) {
        return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
    }

    static issueUserId() {
        const N = 32;
        return crypto.randomBytes(N).toString('base64').substring(0, N);
    }

    static getRoomId(refererUrl) {
        const lastIndex = refererUrl.match("/results/[0-9]+") ? refererUrl.lastIndexOf("/results/") : refererUrl.length;
        return refererUrl.substring(refererUrl.lastIndexOf("/room/")+6, lastIndex);
    }
}

module.exports = Util;