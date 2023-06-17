const VOTING_RULE = {
    ANOYMOUS: 1,
    REALTIME_ANONYMOUS: 2,
    OPEN: 3,
    REALTIME_ANONYMOUS_RESULT_OPEN: 4,
    REALTIME_FULL_OPEN: 5
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
        return this.votingRule = votingRule;
    }

    updateVoteMax(voteMax) {
        const parsed = parseInt(voteMax);
        if (isNaN(parsed)) {
            return null;
        }
        return this.voteMax = parsed;
    }

    updateMinOpenable(minOpenable) {
        const parsed = parseInt(minOpenable);
        if (isNaN(parsed)) {
            return null;
        }
        return this.minOpenable = parsed;
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
        const ret = {size: size, mode: mode};

        if (this.votingRule in [
            VOTING_RULE.OPEN,
            VOTING_RULE.REALTIME_ANONYMOUS_RESULT_OPEN,
            VOTING_RULE.REALTIME_FULL_OPEN
        ]) {
            const results = {};
            for (const [userId, indexes] of Object.entries(this.data)) {
                for (const [rank, index] of Object.entries(indexes)) {
                    if (results[index] === undefined) {
                        results[index] = [];
                    }
                    const vote = {rank: rank};
                    if (this.votingRule in [
                        VOTING_RULE.REALTIME_FULL_OPEN
                    ]) {
                        vote.userId = userId;
                    }
                    results[index].push(vote);
                }
            }
            ret.results = results;
        }

        return ret
    }

    getSummaryResult() {
        const results = {};
        if (Object.keys(this.data).length == 0) {
            return results;
        }
        for (const [userId, indexes] of Object.entries(this.data)) {
            for (const [rank, index] of Object.entries(indexes)) {
                if (results[index] === undefined) {
                    results[index] = [];
                }
                const vote = {rank: rank};
                if (this.votingRule in [
                    VOTING_RULE.REALTIME_ANONYMOUS,
                    VOTING_RULE.REALTIME_ANONYMOUS_RESULT_OPEN,
                    VOTING_RULE.REALTIME_FULL_OPEN
                ]) {
                    vote.userId = userId;
                }
                results[index].push(vote);
            }
        }
        return results;
    }

}

module.exports = Vote;