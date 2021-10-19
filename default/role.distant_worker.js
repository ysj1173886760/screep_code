var {getStructureByFlag} = require('utils');

var distant_worker = {
    // @ts-ignore
    run: function(creep) {
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }

        if (creep.memory.working) {
            // repair structures
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter:(s) => {
                    return (s.structureType == STRUCTURE_ROAD ||
                            s.structureType == STRUCTURE_TOWER || 
                            s.structureType == STRUCTURE_CONTAINER) &&
                            s.hits < s.hitsMax / 2;
                }
            });

            if (target) {
                creep.exRepair(target);
                return;
            }

            // build construction site
            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                creep.exBuild(target);
                return;
            } else {
                // should sending the message to overlord. And request harvester and transfer to continue working
                creep.memory.isNeeded = false;
            }

            // otherwise, send energy back home
            if (creep.room.name != creep.memory.roomname) {
                creep.moveBackHomeRoom()
                return;
            }

            if (creep.room.storage) {
                creep.exTransfer(creep.room.storage, RESOURCE_ENERGY);
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target && target.store.getFreeCapacity() > 0) {
                creep.exTransfer(target);
                return;
            }

            // try to upgrade controller
            creep.exUpgradeController();

        } else {
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                creep.moveToWorkingRoom()
                return;
            }
            
            if (creep.memory.container == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if (target) {
                    creep.memory.container = target.id;
                }
            } else {
                let target = Game.getObjectById(creep.memory.container);
                if (target && target.store[RESOURCE_ENERGY] > 0) {
                    creep.exWithdraw(target, RESOURCE_ENERGY);
                    return;
                }
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

module.exports = distant_worker;