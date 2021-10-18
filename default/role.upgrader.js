var {getStructureByFlag} = require('utils');

var roleUpgrader = {
    /**
     * 
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.upgrading) {
            if (creep.memory.extraInfo.range != undefined) {
                if (!creep.pos.inRangeTo(creep.room.controller, creep.memory.extraInfo.range)) {
                    creep.moveTo(creep.room.controller);
                    return;
                }
            }
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }

        } else {
            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleUpgrader;