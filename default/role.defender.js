var defender = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
            return;
        }

        let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }

        let flag = Game.flags[`defender ${creep.room.name}`];
        if (flag) {
            creep.moveTo(flag, {reusePath: 50});
            return;
        }
        creep.moveTo(creep.room.controller, {reusePath: 50});
    }
};

module.exports = defender;