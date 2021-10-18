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
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            if (creep.room.name != creep.memory.roomname) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.roomname), {reusePath: 50});
                return;
            }

            if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 50});
                }
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target && target.store.getFreeCapacity() > 0) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 50});
                }
                return;
            }

            // try to upgrade controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = distant_worker;