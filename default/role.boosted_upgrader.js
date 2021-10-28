var {getStructureByFlag} = require('utils');

var boosted_upgrader = {
    /**
     * 
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            if (creep.memory.boostStage == undefined) {
                creep.memory.boostStage = 'init';
                return;
            } 

            if (creep.memory.boostStage == 'init') {
                let room = creep.room;
                if (room.memory.boostController.enabled == false) {
                    creep.memory.boosted = true;
                } else {
                    room.memory.boostController.boostQueue.push({
                        id: creep.id,
                        boostResource: creep.memory.extraInfo.boostResource
                    });
                    creep.memory.boostStage = 'wait';
                }
            }

            if (creep.memory.boostStage == 'wait') {
                return;
            }

            if (creep.memory.boostStage == 'prepared') {
                let flag = Game.flags[`boost ${creep.room.name}`];
                if (!creep.pos.isEqualTo(flag.pos)) {
                    creep.moveTo(flag);
                }
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
        
        if (creep.memory.upgrading) {
            if (creep.memory.extraInfo.range != undefined) {
                if (!creep.pos.inRangeTo(creep.room.controller, creep.memory.extraInfo.range)) {
                    creep.moveTo(creep.room.controller);
                    return;
                }
            }
            creep.exUpgradeController();

        } else {
            if (creep.memory.container == undefined) {
                let flag = Game.flags[`upgrade_container ${creep.room.name}`];
                let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                creep.memory.container = target.id;
            }

            let target = Game.getObjectById(creep.memory.container);

            if (target) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = boosted_upgrader;