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
            let target = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
            
            if (target.length && target[0].structureType == STRUCTURE_ROAD && target[0].hits < target[0].hitsMax) {
                creep.exRepair(target[0]);
                return;
            }

            if (creep.room.name != creep.memory.roomname) {
                creep.moveBackHomeRoom();
                return;
            }

            target = creep.room.storage;

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
                creep.moveToWorkingRoom();
                return;
            }

            // pick up the nearby resources
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (target.length > 0) {
                if (creep.pickup(target[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0]);
                }
                return;
            }
            
            if (creep.memory.container == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if (target) {
                    creep.memory.container = target.id;
                }
            }

            target = Game.getObjectById(creep.memory.container);
            if (target) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = distant_transfer;