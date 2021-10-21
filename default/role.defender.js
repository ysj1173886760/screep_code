var defender = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.moveToWorkingRoom();
            return;
        }

        let target = creep.room.find(FIND_HOSTILE_CREEPS);
        if (target.length) {
            if (creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
            return;
        }

        let flag = Game.flags[`defender ${creep.room.name}`];
        if (flag) {
            if (!creep.pos.isEqualTo(flag.pos)) {
                creep.moveTo(flag, {reusePath: 50});
            }
            return;
        }
        creep.moveTo(creep.room.controller, {reusePath: 50});
    }
};

module.exports = defender;