var {getStructureByFlag} = require('utils');

var distant_harvester = {
    run: function(creep) {
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting) {
            if (creep.memory.container == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                creep.memory.container = target.id;
            }

            let target = Game.getObjectById(creep.memory.container);

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
                creep.moveToWorkingRoom();
                return;
            }

            if (creep.memory.working_source == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

                let target = flag.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.working_source = target.id;
            }

            let resource = Game.getObjectById(creep.memory.working_source);
            creep.exHarvestCache(resource, 10);
        }
    }
};

module.exports = distant_harvester;