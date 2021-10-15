var roleHarvester = {
    run: function(creep) {
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            let resource = Game.getObjectById(creep.memory.extraInfo.working_location);
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });

            if (target) {
                if (!creep.pos.isEqualTo(target.pos)) {
                    creep.moveTo(target);
                    return;
                }

                creep.transfer(target, RESOURCE_ENERGY);
            }

        }
    }
};

module.exports = roleHarvester;