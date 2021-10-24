var waller = {
    run: function(creep) {
        if (creep.memory.washing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.washing = false;
        }

        if (!creep.memory.wash && creep.store.getFreeCapacity() == 0) {
            creep.memory.washing = true;
        }

        if (creep.memory.washing) {
            let target = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_WALL ||
                            s.structureType == STRUCTURE_RAMPART) &&
                            s.hits <= creep.memory.extraInfo.maxHits;
                }
            })

            if (target.length) {
                creep.exRepair(target[0]);
                return;
            } else {
                
                // if (creep.isNeeded) {
                //     creep.isNeeded = false;
                //     creep.suicide();
                // }
            }
        } else {
            let storage = creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] >= 10000) {
                creep.exWithdraw(storage, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = waller;