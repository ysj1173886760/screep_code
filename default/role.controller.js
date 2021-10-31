module.exports = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.moveToWorkingRoom();
            return;
        }

        let target = creep.room.controller;
        if (creep.claimController(target) == ERR_NOT_IN_RANGE) {
            creep.goTo(target.pos, 1);
        }
    }
};