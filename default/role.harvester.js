var {getStructureByFlag} = require('utils');

var roleHarvester = {
    run: function(creep) {
        if (creep.room.name != creep.memory.roomname) {
            creep.moveBackHomeRoom();
            return;
        }

        if (creep.memory.shouldBuild == undefined) {
            let res = false;
            for (let i = 0; i < creep.body.length; i++) {
                if (creep.body[i].type == 'carry') {
                    res = true;
                    break;
                }
            }
            creep.memory.shouldBuild = res;
        }

        if (creep.memory.shouldBuild) {
            if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
                creep.memory.harvesting = false;
            }
            if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.harvesting = true;
            }
            if (creep.memory.harvesting) {
                if (creep.memory.positioned && creep.memory.working_source != undefined) {
                    let resource = Game.getObjectById(creep.memory.working_source);
                    creep.exHarvest(resource);
                    return;
                }

                creep.memory.standed = true;
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

                if (!creep.pos.isEqualTo(flag.pos)) {
                    creep.goTo(flag.pos, 0);
                    return;
                }

                creep.memory.positioned = true;
                target = flag.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.working_source = target.id;
            } else {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
                let container = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if (container) {
                    creep.transfer(container, RESOURCE_ENERGY)
                } else {
                    let res = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
                    if (res.length) {
                        creep.build(res[0])
                        return;
                    }

                    creep.room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER)
                }
            }
        } else {
            if (creep.memory.positioned && creep.memory.working_source != undefined) {
                let resource = Game.getObjectById(creep.memory.working_source);
                creep.exHarvest(resource);
                return;
            }

            creep.memory.standed = true;
            let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

            if (!creep.pos.isEqualTo(flag.pos)) {
                creep.goTo(flag.pos, 0);
                return;
            }

            creep.memory.positioned = true;
            target = flag.pos.findClosestByPath(FIND_SOURCES);
            creep.memory.working_source = target.id;
        }
    }
};

module.exports = roleHarvester;