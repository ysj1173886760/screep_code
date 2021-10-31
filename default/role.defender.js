var defender = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.moveToWorkingRoom();
            return;
        }

        let target = creep.room.find(FIND_HOSTILE_CREEPS);
        if (target.length) {
            if (creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
                creep.goTo(target[0].pos, 1);
            }
            return;
        }

        let flag = Game.flags[`defender ${creep.room.name}`];
        if (flag) {
            if (!creep.pos.isEqualTo(flag.pos)) {
                creep.goTo(flag.pos, 1);
            }
            return;
        }
        creep.goTo(creep.room.controller.pos, 1);
    }
};

module.exports = defender;