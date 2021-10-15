var {getStructureByFlag} = require('utils');

var roleBuilder = {
    run: function(creep) {
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0 ) {
            creep.memory.building = false;
        }

        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }

            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if (creep.room.storage) {
                if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }
            let flag = Game.flags[`container ${creep.memory.extraInfo.work_location} ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target && target.store[RESOURCE_ENERGY] > 500) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;