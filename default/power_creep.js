var power_creep = {
    /**
     * 
     * @param {PowerCreep} creep 
     */
    run: function(creep) {
        if (!creep.ticksToLive) {
            return;
        }

        if (!creep.memory.spawn) {
            let pws = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_POWER_SPAWN;
                }
            });
            if (pws.length) {
                creep.memory.spawn = pws[0].id;
            }
        }

        if (creep.ticksToLive < 200) {
            let spawn = Game.getObjectById(creep.memory.spawn);
            if (spawn) {
                if (!creep.pos.inRangeTo(spawn, 1)) {
                    creep.goTo(spawn.pos, 1);
                } else {
                    creep.renew(spawn);
                }
                return;
            }
        }

        if (!creep.room.controller.isPowerEnabled) {
            if (creep.pos.inRangeTo(creep.room.controller, 1)) {
                creep.enableRoom(creep.room.controller);
            } else {
                creep.goTo(creep.room.controller.pos, 1);
            }
            return;
        }

        if (creep.memory.stage == undefined || creep.memory.stage == 'wait') {
            creep.memory.stage = 'wait';
            if (creep.store.getFreeCapacity(RESOURCE_OPS) == 0) {
                creep.exTransfer(creep.room.storage, RESOURCE_OPS);
            } else {
                if (creep.powers[PWR_GENERATE_OPS] && creep.powers[PWR_GENERATE_OPS].cooldown == 0) {
                    creep.usePower(PWR_GENERATE_OPS);
                }
            }
        }
    }
};

module.exports = power_creep;