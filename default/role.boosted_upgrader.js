var {getStructureByFlag} = require('utils');

var boosted_upgrader = {
    /**
     * 
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            if (creep.memory.boostStage == undefined) {
                let room = creep.room;
                if (room.memory.boostController.enabled == false) {
                    creep.memory.boosted = true;
                    return;
                }
                creep.memory.boostStage = 'init';
                return;
            } 

            if (creep.memory.boostStage == 'init') {
                let task = {
                    boostResource: creep.memory.extraInfo.boostResource,
                    id: creep.id,
                };
                let room = creep.room
                
                room.memory.boostController.boostQueue.push(task);
                creep.memory.boostStage = 'wait';
            }
            

            if (creep.memory.boostStage == 'wait') {
                return;
            }

            if (creep.memory.boostStage == 'prepared') {
                return;
            }

            if (creep.memory.boostStage == 'failed') {
                creep.memory.extraInfo.needBoost = false;
                creep.memory.boosted = true;
            }

            if (creep.memory.boostStage == 'ok') {
                creep.memory.boosted = true;
            }
            return;
        }

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }

        if (creep.memory.bodyPart == undefined) {
            creep.memory.bodyPart = creep.getActiveBodyparts(WORK);
        }
        
        if (creep.memory.container == undefined) {
            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            creep.memory.container = target.id;
        }

        creep.memory.standed = true;
        if (creep.memory.upgrading) {
            if (creep.memory.extraInfo.range != undefined) {
                if (!creep.pos.inRangeTo(creep.room.controller, creep.memory.extraInfo.range)) {
                    // creep.moveTo(creep.room.controller);
                    creep.goTo(creep.room.controller, 1);
                    return;
                }
            }

            if (creep.store[RESOURCE_ENERGY] <= creep.memory.bodyPart) {
                let target = Game.getObjectById(creep.memory.container);
                if (target) {
                    creep.exWithdraw(target, RESOURCE_ENERGY);
                }
            }

            creep.exUpgradeController();

        } else {

            let target = Game.getObjectById(creep.memory.container);

            if (target) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = boosted_upgrader;