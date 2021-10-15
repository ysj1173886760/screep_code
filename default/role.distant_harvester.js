var distant_harvester = {
    run: function(creep) {
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting) {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });

            if (target) {
                if (target.hits < target.hitsMax) {
                    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }

                if (!creep.pos.isEqualTo(target.pos)) {
                    creep.moveTo(target);
                    return;
                }

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {reusePath: 50});
                }
                return;
            }

        } else {
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
                return;
            }
            
            let resource = Game.getObjectById(creep.memory.extraInfo.working_location);
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 50});
            }
        }
    }
};

module.exports = distant_harvester;