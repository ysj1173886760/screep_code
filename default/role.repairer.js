var {upgradeController} = require('utils');

var roleRepairer = {
    run: function(creep) {
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }

        if (creep.memory.repairing) {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter:(s) => {
                    return (s.structureType == STRUCTURE_ROAD ||
                            s.structureType == STRUCTURE_TOWER || 
                            s.structureType == STRUCTURE_CONTAINER) &&
                            s.hits < s.hitsMax;
                }
            });
            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }
            
            upgradeController(creep);

        } else {
            let target = creep.room.find(FIND_STRUCTURES, {
                filter:(s) => {
                    return (s.structureType == STRUCTURE_CONTAINER) &&
                            s.store[RESOURCE_ENERGY] > 500;
                }
            });

            if (target.length > 0) {
                if (creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
            }
        }
    }
};

module.exports = roleRepairer;