var {getStructureByFlag} = require('utils');

var roleTransfer = {
    getNextTarget(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_TOWER) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }
        creep.memory.target = undefined;
    },
    run: function(creep) {
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            if (creep.memory.target) {
                let tmp = Game.getObjectById(creep.memory.target)
                if (tmp && tmp.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    this.getNextTarget(creep);
                }
            } else {
                this.getNextTarget(creep);
            }

            let target = Game.getObjectById(creep.memory.target);
            
            if (target) {
                creep.exTransfer(target, RESOURCE_ENERGY);
                return;
            }

            target = creep.room.storage;
            if (target) {
                creep.exTransferAll(target);
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);

            if (target) {
                creep.exTransfer(target, RESOURCE_ENERGY);
                return;
            }

        } else {

            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (target.length > 0) {
                creep.exPickup(target[0]);
                return;
            }

            if (creep.memory.container == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];
                target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                creep.memory.container = target.id;
            }
            
            target = Game.getObjectById(creep.memory.container);

            if (target) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
            }
        }
    }
}

module.exports = roleTransfer;