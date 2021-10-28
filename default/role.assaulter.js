var assaulter = {
    run: function(creep) {
        if (creep.room.name != creep.memory.extraInfo.attack_room) {
            creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.attack_room));
            return;
        }

        let flag = Game.flags[`attack`];
        if (!flag) {
            return;
        }

        if (!creep.pos.inRangeTo(flag, 5)) {
            creep.moveTo(flag);
        }

        let target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
        if (creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target[0]);
        }
    }
}

module.exports = assaulter;