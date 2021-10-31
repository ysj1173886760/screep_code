var {getStructureByFlag} = require('utils');

var roleBuilder = {
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0 ) {
            creep.memory.building = false;
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }

        if (creep.room.name != creep.memory.roomname) {
            creep.moveBackHomeRoom();
        }
        creep.memory.standed = true;
        if (creep.memory.building) {
            let target = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (target.length) {
                creep.exBuild(target[0]);
                return;
            }

            creep.exUpgradeController();

        } else {
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] > 1000) {
                creep.exWithdraw(creep.room.storage, RESOURCE_ENERGY);
                return;
            }
            
            if (creep.memory.extraInfo.working_location == 2) {
                let flag = Game.flags[`upgrade_container ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if (target && target.store[RESOURCE_ENERGY] > 500) {
                    creep.exWithdraw(target, RESOURCE_ENERGY);
                }
                return;
            }

            let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target && target.store[RESOURCE_ENERGY] > 500) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
                return;
            }
            
            if (creep.memory.working_source == undefined && flag) {
                let target = flag.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.working_source = target.id;
            }

            let resource = Game.getObjectById(creep.memory.working_source);
            creep.exHarvestCache(resource, 10);
        }
    }
};

module.exports = roleBuilder;