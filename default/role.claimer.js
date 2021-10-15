module.exports = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
            return;
        }

        let target = creep.room.controller;
        if (creep.memory.extraInfo.claim == true) {
            if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {reusePath: 50});
            }
            return;
        }

        if (creep.reserveController(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {reusePath: 50});
        }
    }
};