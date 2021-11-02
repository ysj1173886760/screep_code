var power_attacker = {
    run: function(creep) {
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }

        let flag = Game.flags[`power ${creep.memory.extraInfo.squad.id} ${creep.room.name}`];
        if (!flag) {
            return;
        }

        if (creep.room.name != flag.pos.roomName) {
            creep.goTo(new RoomPosition(25, 25, flag.pos.roomName), 20);
            return;
        }

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

        if (!creep.pos.inRangeTo(powerbank, 1)) {
            creep.goTo(powerbank.pos, 1);
            return;
        }

        if (creep.hits > creep.hitsMax / 2) {
            creep.attack(powerbank);
        }
    }
};

module.exports = power_attacker;