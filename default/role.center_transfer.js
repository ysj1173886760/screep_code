var {getStructureByFlag} = require('utils');

module.exports = {
    run: function(creep) {
        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfer = false;
        }

        if (!creep.memory.transfer && creep.store.getUsedCapacity() != 0) {
            creep.memory.transfer = true;
        }

        let flag = Game.flags[`center ${creep.room.name}`];
        if (!creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag);
            return;
        }

        if (creep.memory.transfer) {
            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
        } else {
            let target_link = getStructureByFlag(Game.flags[`target_link ${creep.room.name}`], STRUCTURE_LINK);
            if (target_link && target_link.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(target_link, RESOURCE_ENERGY);
            }
        }
    }
}