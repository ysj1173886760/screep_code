module.exports = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.goTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), 20);
            return;
        }

        let target = creep.room.controller;
        if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
            creep.goTo(target.pos, 1);
            return;
        }

        creep.signController(target, "relay room")
    }
};