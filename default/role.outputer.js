var {getStructureByFlag} = require('utils');

var outputer = {
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
            if (creep.memory.extraInfo.maintaining) {
                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => {
                        return (s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN) && 
                                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

                    }
                });
                
                if (target) {
                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                    }
                    return;
                }
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            // let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            // if (target.length > 0) {
            //     creep.exPickupCache(target[0], 10);
            //     return;
            // }
            
            if (creep.room.storage) {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage);
                }
            }
        }
    }
};

module.exports = outputer;