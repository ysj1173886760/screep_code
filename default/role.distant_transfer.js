const { get } = require('lodash');
var {getStructureByFlag} = require('utils');

var distant_transfer = {
    // @ts-ignore
    run: function(creep) {
        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
        }

        if (creep.memory.transfering) {
            if (creep.room.name != creep.memory.roomname) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.roomname), {reusePath: 50});
                return;
            }

            let target = creep.room.storage;
            if (target) {
                for (let resourceType in creep.store) {
                    if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                        break;
                    }
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

        } else {
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
                return;
            }

            // pick up the nearby resources
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 3);
            if (target.length > 0) {
                if (creep.pickup(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
                return;
            }
            
            let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 50});
            }
        }
    }
};

module.exports = distant_transfer;