var {getStructureByFlag} = require('utils');

var distant_transfer = {
    // @ts-ignore
    run: function(creep) {
        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }
        if (creep.memory.transfering && creep.store.getUsedCapacity() == 0) {
            creep.memory.transfering = false;
        }
        
        if (creep.memory.shouldRepair == undefined) {
            let res = false;
            for (let i = 0; i < creep.body.length; i++) {
                if (creep.body[i].type == 'work') {
                    res = true;
                    break;
                }
            }
            creep.memory.shouldRepair = res;
        }

        if (creep.memory.transfering) {
            if (creep.memory.shouldRepair && creep.room.name != creep.memory.roomname) {
                let target = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos);
                
                if (target.length && target[0].structureType == STRUCTURE_ROAD && target[0].hits < target[0].hitsMax) {
                    creep.exRepair(target[0]);
                    return;
                }
            }

            if (creep.room.name != creep.memory.roomname) {
                // creep.moveTo(new RoomPosition(25, 25, creep.memory.roomname), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
                creep.moveBackHomeRoom();
                return;
            }

            target = creep.room.storage;

            if (target) {
                // creep.moveTo(target);
                creep.exTransferAll(target);
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if (target && target.store.getFreeCapacity() > 0) {
                creep.exTransfer(target, RESOURCE_ENERGY);
                return;
            }

        } else {
            // pick up the nearby resources
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (target.length > 0) {
                creep.exPickup(target[0]);
                return;
            }
            
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                // if we have already picked up a lot resources, and we havn't gone to working room yet. Then we send those energy back directly
                if (creep.store.getFreeCapacity() < creep.store.getCapacity() / 2) {
                    creep.memory.transfering = true;
                    return;
                }
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
                creep.exWithdraw(target, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = distant_transfer;