module.exports = {
    run: function(creep) {
        if (!creep.memory.repairing && creep.store.getFreeCapacity() == 0) {
            creep.memory.repairing = true;
        }

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.repairing = false;
        }

        if (creep.room.name != creep.working_room) {
            creep.moveToWorkingRoom();
        }
        
        if (creep.memory.repairing) {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter:(s) => {
                    return (s.structureType == STRUCTURE_ROAD ||
                            s.structureType == STRUCTURE_CONTAINER) &&
                            s.hits < s.hitsMax - 1000;
                }
            });

            if (target) {
                creep.exRepairCache(target, 10);
                return;
            }

        } else {
            target = creep.room.find(FIND_STRUCTURES, {
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
}