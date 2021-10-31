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
                    creep.exTransfer(target, RESOURCE_ENERGY);
                    return;
                }
            }

            if (creep.memory.container == undefined) {
                let flag = Game.flags[`upgrade_container ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if (target) {
                    creep.memory.container = target.id;
                }
            }

            let container = Game.getObjectById(creep.memory.container);
            if (container) {
                let ret = creep.transfer(container, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.goTo(container.pos);
                } else if (ret == OK) {
                    creep.goTo(creep.room.storage.pos);
                }
            }
        } else {
            // let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            // if (target.length > 0) {
            //     creep.exPickupCache(target[0], 10);
            //     return;
            // }
            
            if (creep.room.storage) {
                let ret = creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    // creep.moveTo(creep.room.storage);
                    creep.goTo(creep.room.storage.pos);
                } else if (ret == OK) {
                    if (creep.memory.container) {
                        let container = Game.getObjectById(creep.memory.container);
                        if (container) {
                            // creep.moveTo(container);
                            creep.goTo(container.pos);
                        }
                    }
                }
            }
        }
    }
};

module.exports = outputer;