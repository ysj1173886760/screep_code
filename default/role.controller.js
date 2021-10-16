module.exports = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            if (creep.memory.extraInfo.path) {
                let pth = creep.memory.extraInfo.path;
                for (let i = 0; i < pth.length; i++) {
                    if (pth[i] == creep.room.name) {
                        let nxt = pth[i + 1];
                        creep.moveTo(new RoomPosition(25, 25, nxt), {reusePath: 50});
                        return;
                    }
                }
            }
            creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
            return;
        }

        let target = creep.room.controller;
        if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {reusePath: 50});
        }
    }
};