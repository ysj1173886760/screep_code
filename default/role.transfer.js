var {getStructureByFlag} = require('utils');

var roleTransfer = {
    run: function(creep) {
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
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

            target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_TOWER) && 
                            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

                }
            });
            
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
                return;
            }

            target = creep.room.storage;
            if (target) {
                for (let resourceType in creep.store) {
                    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                        break;
                    }
                }
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
                return;
            }

        } else {

            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 3);
            if (target.length > 0) {
                if (creep.pickup(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
                return;
            }

            let flag = Game.flags[`container ${creep.memory.extraInfo.work_location} ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);

            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
            }
        }
    }
}

module.exports = roleTransfer;