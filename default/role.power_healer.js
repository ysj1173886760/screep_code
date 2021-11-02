var power_healer = {
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

        if (!creep.pos.inRangeTo(powerbank, 2)) {
            creep.goTo(powerbank.pos, 2);
            return;
        }

        let target = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => {
                return c.hits < c.hitsMax;
            }
        });
        if (target.length) {
            if (!creep.pos.inRangeTo(target[0], 1)) {
                creep.goTo(target[0].pos, 1);
            } else {
                creep.heal(target[0]);
            }
        }
    }
};

module.exports = power_healer;