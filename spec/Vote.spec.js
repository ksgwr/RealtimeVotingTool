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
    });

    it("getOnGoingResult Realtime Full Open Data", function(){
        const target = new Vote();

        target.data = {
            'aaa' : [1],
            'bbb' : [1, 2]
        };
        target.mode = 3;
        target.minOpenable = 2;
        target.votingRule = 5;

        expect(target.getOnGoingResult()).toEqual({
            size: 2,
            mode: 4,
            openId: true,
            results: {
                1: [{userId: 'aaa', rank: 0},{userId: 'bbb', rank: 0}],
                2: [{userId: 'bbb', rank: 1}]
            }
        });
    })
});