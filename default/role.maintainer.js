var {
    getStructureByFlag
} = require('utils');

var maintainer = {
    getNextTargetAhead(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_TOWER) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 300 &&
                        s.id != creep.memory.target;

            }
        });
        if (target) {
            return target.id;
        }
        
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                        s.id != creep.memory.target;

            }
        });
        if (target) {
            return target.id;
        }

        return null;
    },
    getNextTarget(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_TOWER) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 300;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
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

        creep.memory.target = undefined;
    },

    run: function(creep) {
        if (creep.memory.transfering && creep.store.getUsedCapacity() == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.target = undefined;
            creep.memory.transfering = true;
        }

        creep.memory.crossLevel = 12;
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
                let ret = creep.transfer(target, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.goTo(target.pos, 1);
                    // creep.moveTo(target);
                } else if (ret == OK) {
                    let nxt = Game.getObjectById(this.getNextTargetAhead(creep));
                    if (nxt && nxt.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        // creep.moveTo(nxt);
                        creep.goTo(nxt.pos, 1);
                        creep.memory.target = nxt.id;
                    } else {
                        creep.memory.target = null;
                    }
                }
                return;
            }

            target = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_NUKER &&
                            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (target.length) {
                creep.exTransfer(target[0], RESOURCE_ENERGY);
                return;
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