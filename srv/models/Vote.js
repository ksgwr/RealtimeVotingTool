const VOTING_RULE = {
    ANOYMOUS: 0
};

const MODE = {
    VOTE_START: 2,
    VOTING: 3,
    OPENABLE: 4
};

class Vote {

    constructor() {
        // rule init
        this.votingRule = VOTING_RULE.ANOYMOUS;
        this.voteMax = 1;
        this.minOpenable = 1;

        // voting data
        this.data = {};
    }

    updateVotingRule(votingRule) {
        this.votingRule = votingRule;
    }

    updateVoteMax(voteMax) {
        this.voteMax = voteMax;
    }

    updateMinOpenable(minOpenable) {
        this.minOpenable = minOpenable;
    }

    initVote() {
        this.data = {};
    }

    vote(userId, itemIndexes) {
        this.data[userId] = itemIndexes;
    }

    cancel(userId) {
        delete this.data[userId];
    }

    getRules() {
        return {
            votingRule : this.votingRule,
            voteMax : this.voteMax,
            minOpenable : this.minOpenable
        }
    }

    getOnGoingResult() {
        const size = Object.keys(this.data).length;
        let mode;
        if (size == 0) {
            mode = MODE.VOTE_START;
        } else if (size < this.minOpenable) {
            mode = MODE.VOTING;
        } else {
            mode = MODE.OPENABLE;
        }
        return {
            size: size,
            mode: mode
        };
    }

    getSummaryResult() {
        const result = {}
        if (Object.keys(this.data).length == 0) {
            return result;
        }
        for (const [userId, indexes] of Object.entries(this.data)) {
            for (const [rank, index] of Object.entries(indexes)) {
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