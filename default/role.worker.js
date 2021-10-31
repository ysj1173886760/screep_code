module.exports = {
    run: function(creep) {
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }

        if (creep.memory.working) {
            if (creep.memory.extraInfo.building) {
                let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

                if (target) {
                    creep.exBuild(target);
                    return;
                }

            } else {
                // first fill the structures
                let target = creep.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => {
                        return ((s.structureType == STRUCTURE_SPAWN || 
                            s.structureType == STRUCTURE_EXTENSION ||
                            s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
                });

                if (target.length > 0) {
                    creep.exTransfer(target[0]);
                    return;
                }

            }

            // try to upgrade controller
            creep.exUpgradeController(creep.room.controller);

        } else {
            if (creep.memory.working_source == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

                let target = flag.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.working_source = target.id;
            }

            let resource = Game.getObjectById(creep.memory.working_source);
            creep.exHarvest(resource);
        }
    }
};