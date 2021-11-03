var {getStructureByFlag} = require('utils');

var roleUpgrader = {
    /**
     * 
     * @param {Creep} creep 
     */
    run: function(creep) {
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }

        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }

        creep.memory.standed = true;
        if (creep.memory.upgrading) {
            if (creep.memory.extraInfo.range != undefined) {
                if (!creep.pos.inRangeTo(creep.room.controller, creep.memory.extraInfo.range)) {
                    creep.goTo(creep.room.controller.pos, creep.memory.extraInfo.range);
                    return;
                }
            }
            creep.exUpgradeController();

        } else {
            if (creep.memory.container == undefined) {
                let flag = Game.flags[`upgrade_link ${creep.room.name}`];
                if (flag) {
                    let target = getStructureByFlag(flag, STRUCTURE_LINK);
                    creep.memory.container = target.id;
                } else {
                    flag = Game.flags[`upgrade_container ${creep.room.name}`];
                    let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                    creep.memory.container = target.id;
                }
            }

            let target = Game.getObjectById(creep.memory.container);

            if (target) {
                creep.exWithdraw(target, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleUpgrader;