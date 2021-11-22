const Util = require("../lib/Util.js");

describe("Util test", function(){
    it("should issue user id ramdom 32 chars", function() {
        const userId = Util.issueUserId();
        expect(userId.length).toBe(32);
    });
    
    it("should get room id", function() {
        const roomId = Util.getRoomId("http://localhost/room/roomId");
        expect(roomId).toBe("roomId");
    });
});