const { transform } = require('lodash');
var {getStructureByFlag} = require('utils');

module.exports = {
    run: function(creep) {
        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfer = false;
        }

        if (!creep.memory.transfer && creep.store.getUsedCapacity() != 0) {
            creep.memory.transfer = true;
        }

        // initialize part
        let flag = Game.flags[`center ${creep.room.name}`];
        if (!creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag);
            return;
        }

        if (creep.memory.link == undefined) {
            let target_link = getStructureByFlag(Game.flags[`target_link ${creep.room.name}`], STRUCTURE_LINK);
            if (target_link) {
                creep.memory.link = target_link.id;
            }
        }

        if (creep.memory.transfer) {
            if (creep.memory.transferToTerminal) {
                creep.exTransferAll(creep.room.terminal);
            } else {
                creep.exTransferAll(creep.room.storage);
            }

        } else {
            let target_link = Game.getObjectById(creep.memory.link);
            if (target_link && target_link.store.getUsedCapacity(RESOURCE_ENERGY) != 0) {
                creep.memory.transferToTerminal = false;
                creep.withdraw(target_link, RESOURCE_ENERGY);
                return;
            }

            let storage = creep.room.storage;
            let terminal = creep.room.terminal;
            if (terminal) {
                if (terminal.store[RESOURCE_ENERGY] > 20000) {
                    creep.withdraw(terminal, RESOURCE_ENERGY);
                    creep.memory.transferToTerminal = false;
                    return;
                } else if (terminal.store[RESOURCE_ENERGY] < 10000) {
                    creep.withdraw(storage, RESOURCE_ENERGY);
                    creep.memory.transferToTerminal = true;
                    return;
                }
                
                creep.memory.transferToTerminal = false;
                for (let resourceType in terminal.store) {
                    if (resourceType != 'energy') {
                        creep.withdraw(terminal, resourceType);
                    }
                }
            }


        }
    }
}