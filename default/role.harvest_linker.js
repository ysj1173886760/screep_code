var {
    getStructureByFlag
} = require('utils');

module.exports = {
    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.bodyPart == undefined) {
            creep.memory.bodyPart = creep.getActiveBodyparts(WORK);
        }

        if (creep.memory.link == undefined) {
            let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
            let target = flag.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_LINK;
                }
            })
            creep.memory.link = target.id;
        }

        creep.memory.standed = true;
        if (creep.memory.harvesting) {
            if (creep.memory.positioned && creep.memory.working_source != undefined) {
                let container = Game.getObjectById(creep.memory.container);
                if (container.store[RESOURCE_ENERGY] > 50) {
                    creep.withdraw(container, RESOURCE_ENERGY);
                    return;
                }

                let resource = Game.getObjectById(creep.memory.working_source);

                // if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 2 * creep.memory.bodyPart) {
                //     let link = Game.getObjectById(creep.memory.link);
                //     if (link) {
                //         creep.exTransfer(link, RESOURCE_ENERGY);
                //     }
                // }
                creep.harvest(resource);
                return;
            }

            
            if (creep.memory.extraInfo.working_location == undefined) {
                creep.memory.extraInfo.working_location = 0;
            }
            let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

            if (!creep.pos.isEqualTo(flag.pos)) {
                creep.goTo(flag.pos, 0);
                return;
            }

            creep.memory.positioned = true;
            target = flag.pos.findClosestByRange(FIND_SOURCES);
            creep.memory.working_source = target.id;
            creep.memory.container = getStructureByFlag(flag, STRUCTURE_CONTAINER).id;

        } else {
            let link = Game.getObjectById(creep.memory.link);
            creep.exTransfer(link, RESOURCE_ENERGY);
        }

    }
}