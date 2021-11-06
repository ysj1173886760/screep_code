var {upgradeController} = require('utils');

var extender = {
    // @ts-ignore
    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }

        if (creep.room.name != creep.memory.extraInfo.working_room) {
            creep.moveToWorkingRoom();
            return;
        }

        
        if (creep.memory.harvesting) {
            if (creep.memory.working_source == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

                // if (!creep.pos.isEqualTo(flag.pos)) {
                //     creep.moveTo(flag);
                //     return;
                // }

                let target = flag.pos.findClosestByPath(FIND_SOURCES);
                if (target) {
                    creep.memory.working_source = target.id;
                }
            }

            let resource = Game.getObjectById(creep.memory.working_source);
            creep.exHarvest(resource);

        } else {
            let target = creep.room.find(FIND_STRUCTURES, {
                // @ts-ignore
                filter: (s) => {
                    return (s.structureType == STRUCTURE_SPAWN ||
                            s.structureType == STRUCTURE_EXTENSION) &&
                            s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (target.length > 0) {
                creep.exTransfer(target[0], RESOURCE_ENERGY);
                return;
            }
            
            target = creep.room.find(FIND_STRUCTURES, {
                filter:(s) => {
                    return (s.structureType == STRUCTURE_ROAD ||
                            s.structureType == STRUCTURE_CONTAINER) &&
                            s.hits < s.hitsMax / 2;
                }
            });

            if (target.length) {
                creep.exRepairCache(target[0], 10);
                return;
            }
            

            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                creep.exBuild(target)
                return;
            }

            upgradeController(creep);
        }
    }
};

module.exports = extender;