var power_healer = {
    run: function(creep) {
        // creep.memory.extraInfo.boostResource = ['XLHO2'];
        // creep.memory.extraInfo.needBoost = true;
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }

        let flag = Game.flags[`power ${creep.memory.extraInfo.squadId} ${creep.memory.roomname}`];
        if (!flag) {
            return;
        }

        if (creep.room.name != flag.pos.roomName) {
            creep.goTo(new RoomPosition(25, 25, flag.pos.roomName), 20);
            return;
        }

        creep.memory.standed = true;
        if (!creep.memory.powerbank) {
            let powerbank = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_POWER_BANK;
                }
            });
            if (powerbank.length) {
                creep.memory.powerbank = powerbank[0].id;
            }
        }

        let powerbank = Game.getObjectById(creep.memory.powerbank);

        if (!powerbank) {
            return;
        }
        if (!creep.pos.inRangeTo(powerbank, 2)) {
            creep.goTo(powerbank.pos, 2);
            return;
        }

        if (!creep.memory.attacker) {
            let targets = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    return c.memory.role == 'power_attacker' &&
                            c.memory.extraInfo &&
                            c.memory.extraInfo.squadId == creep.memory.extraInfo.squadId;
                }
            });
            if (targets.length) {
                creep.memory.attacker = targets[0].id;
            }
        }

        let target = Game.getObjectById(creep.memory.attacker);
        if (target) {
            if (!creep.pos.inRangeTo(target, 1)) {
                creep.goTo(target.pos, 1);
            } else {
                creep.heal(target);
            }
        }
    }
};

module.exports = power_healer;