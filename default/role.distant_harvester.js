var {getStructureByFlag} = require('utils');

var distant_harvester = {
    run: function(creep) {
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        creep.memory.standed = true;
        if (!creep.memory.harvesting) {
            if (creep.memory.container == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if (!target) {
                    let c = flag.pos.lookFor(LOOK_CONSTRUCTION_SITES);
                    if (c.length) {
                        creep.build(c[0])
                        return;
                    }
                } else {
                    creep.memory.container = target.id;
                }
            }

            let target = Game.getObjectById(creep.memory.container);

            if (target) {
                if (target.hits < target.hitsMax - 1000) {
                    creep.exRepair(target);
                    return;
                }

                if (!creep.pos.isEqualTo(target.pos)) {
                    creep.goTo(target.pos, 0);
                    return;
                }

                creep.exTransfer(target, RESOURCE_ENERGY);
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
            creep.exHarvest(resource);
        }
    }
};

module.exports = distant_harvester;