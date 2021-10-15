const { get } = require('lodash');
var {getStructureByFlag} = require('utils');

var distant_transfer = {
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

            if (creep.room.storage) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == 0) {
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

        } else {
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
                return;
            }
            
            let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 50});
            }
        }
    }
};

module.exports = distant_transfer;