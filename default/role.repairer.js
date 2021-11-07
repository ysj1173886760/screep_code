var {upgradeController} = require('utils');

var roleRepairer = {
    getNextTarget(creep) {
        let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter:(s) => {
                return (s.structureType == STRUCTURE_ROAD ||
                        s.structureType == STRUCTURE_TOWER || 
                        s.structureType == STRUCTURE_CONTAINER) &&
                        s.hits < s.hitsMax - 500;
            }
        });
        if (target) {
            creep.memory.target = target.id;
        } else {
            creep.memory.target = undefined;
        }
    },

    run: function(creep) {
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }

        if (creep.room.name != creep.memory.roomname) {
            creep.moveBackHomeRoom();
            return;
        }
        
        if (creep.memory.repairing) {
            if (creep.memory.target) {
                let tmp = Game.getObjectById(creep.memory.target)
                if (tmp && !(tmp.hits < tmp.hitsMax - 500)) {
                    this.getNextTarget(creep);
                }
            } else {
                this.getNextTarget(creep);
            }

            let target = Game.getObjectById(creep.memory.target);
            if (target) {
                creep.exRepair(target);
                return;
            }

            target = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (target.length) {
                creep.exBuild(target[0]);
                return;
            }
            
            upgradeController(creep);

        } else {
            let target = creep.room.storage;
            if (target && target.store[RESOURCE_ENERGY] > 5000) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
                return;
            }
            
            target = creep.room.find(FIND_STRUCTURES, {
                filter:(s) => {
                    return (s.structureType == STRUCTURE_CONTAINER) &&
                            s.store[RESOURCE_ENERGY] > 500;
                }
            });

            if (target.length > 0) {
                creep.exWithdraw(target[0], RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleRepairer;