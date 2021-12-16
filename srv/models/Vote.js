const VOTING_RULE = {
    ANOYMOUS: 0
};

class Vote {

    constructor() {
        // rule init
        this.votingRule = VOTING_RULE.ANOYMOUS;
        this.voteMax = 1;

        // voting data
        this.data = {};
    }

    vote(userId, itemIndexes) {
        this.data[userId] = itemIndexes;
    }

    cancel(userId) {
        delete this.data[userId];
    }

    getOnGoingResult() {
        return {
            size: this.data.length
        };
    }

    getSummaryResult() {
        const result = {}
        for (const [userId, indexes] of this.data.entries()) {
            for (const [rank, index] of indexes.entries()) {
                if (result[index] === undefined) {
                    result[index] = [];
                }
                // TODO: 匿名時にuserIdを置き換え
                result[index].push({
                    userId: userId,
                    rank: rank
                });
            }
        }

        return result;
    }

}

module.exports = Vote;