var {
    getStructureByFlag
} = require('utils');

var maintainer = {
    run: function(creep) {
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            // let terminal = creep.room.terminal;
            // if (terminal) {
            //     creep.exTransfer(terminal, RESOURCE_ENERGY);
            //     return;
            // }
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_EXTENSION ||
                            s.structureType == STRUCTURE_SPAWN) && 
                            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

                }
            });
            
            if (target) {
                creep.exTransfer(target, RESOURCE_ENERGY);
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target) {
                creep.exTransfer(target, RESOURCE_ENERGY);
            }
        } else {
            if (creep.room.storage) {
                creep.exWithdraw(creep.room.storage, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = maintainer;