var {
    getStructureByFlag
} = require('utils');

var maintainer = {
    getNextTarget(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_TOWER) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }
        creep.memory.target = undefined;
    },

    run: function(creep) {
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.target = undefined;
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            // let terminal = creep.room.terminal;
            // if (terminal) {
            //     creep.exTransfer(terminal, RESOURCE_ENERGY);
            //     return;
            // }
            if (creep.memory.target) {
                let tmp = Game.getObjectById(creep.memory.target)
                if (tmp && tmp.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    this.getNextTarget(creep);
                }
            } else {
                this.getNextTarget(creep);
            }

            if (creep.memory.target == undefined && creep.store.getFreeCapacity() != 0) {
                creep.memory.transfering = false;
                return;
            }

            let target = Game.getObjectById(creep.memory.target);
            
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
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (target.length > 0) {
                creep.exPickupCache(target[0], 10);
                return;
            }
            
            if (creep.store[RESOURCE_ENERGY] == 0 && creep.store.getUsedCapacity() != 0) {
                creep.exTransferAll(creep.room.storage);
                return;
            }

            if (creep.room.storage) {
                creep.exWithdraw(creep.room.storage, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = maintainer;