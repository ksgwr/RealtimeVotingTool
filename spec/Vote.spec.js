const Vote = require("../srv/models/Vote.js");

describe("Vote test", function(){
    it("should return summary results", function(){
        const target = new Vote();

        target.vote('aaa', [1]);

        expect(target.data).toEqual({'aaa': [1]});
        
        /*
        expect(target.getSummaryResult()).toEqual({
            1 : [{userId: 'aaa', rank: 0}]
        });*/
    })
});