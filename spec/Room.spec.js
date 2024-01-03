const Room = require('../srv/models/Room.js');

describe("Room test", function(){
    it("getOnGoingResult merge User Data", function(){
        const vote = jasmine.createSpyObj('Vote', [ 'getOnGoingResult' ]);
        vote.getOnGoingResult.and.returnValue({
            mode: 4,
            openId: true,
            results: {
                1: [{userId: 'aaa', rank: 0},{userId: 'bbb', rank: 0}],
                2: [{userId: 'bbb', rank: 1}]
            }
        });
        const target = new Room('aaa');
        target.vote = vote;
        target.openUsers = {
            'aaa': {name: 'AAA', icon: 'aaa.png'},
            'bbb': {name: 'BBB', icon: 'bbb.png'}
        };

        expect(target.getOnGoingResult()).toEqual({
            mode: 4,
            openId: true,
            results: {
                1: [{userId: 'aaa', rank: 0, name: 'AAA', icon: 'aaa.png'},{userId: 'bbb', rank: 0, name: 'BBB', icon: 'bbb.png'}],
                2: [{userId: 'bbb', rank: 1, name: 'BBB', icon: 'bbb.png'}]
            }
        });
    });
});