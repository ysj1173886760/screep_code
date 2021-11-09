var {getStructureByFlag} = require('utils');

var distant_linker = {
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
                // creep.moveTo(new RoomPosition(25, 25, creep.memory.roomname), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
                creep.moveBackHomeRoom();

                return;
            }

            let target = creep.pos.findInRange(FIND_STRUCTURES, 5, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_LINK;
                }
            });
            if (target.length) {
                creep.exTransfer(target[0], RESOURCE_ENERGY);
            }

        } else {
            // pick up the nearby resources
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (target.length > 0) {
                creep.exPickupCache(target[0], 20);
                return;
            }
            
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                // creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
                creep.moveToWorkingRoom();
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
                creep.exWithdrawCache(target, RESOURCE_ENERGY, 20);
            }
        }
    }
};

module.exports = distant_linker;