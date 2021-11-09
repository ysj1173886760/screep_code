var power_healer = {
    run: function(creep) {
        // creep.memory.extraInfo.boostResource = ['XLHO2'];
        // creep.memory.extraInfo.needBoost = true;
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }

        let flag = Game.flags[`${creep.memory.extraInfo.powerbank}`];
        if (!flag) {
            return;
        }

        if (creep.room.name != flag.pos.roomName) {
            creep.goTo(new RoomPosition(25, 25, flag.pos.roomName), 20);
            return;
        }

        creep.memory.crossLevel = 11;

        let powerbank = Game.getObjectById(creep.memory.extraInfo.powerbank);

        if (!powerbank) {
            creep.memory.standed = false;
            return;
        } else {
            creep.memory.standed = true;
        }
        if (!creep.memory.attacker) {
            if (!creep.pos.inRangeTo(powerbank, 3)) {
                creep.goTo(powerbank.pos, 3);
                return;
            }
        }
        

        if (!creep.memory.attacker) {
            let targets = creep.room.find(FIND_MY_CREEPS, {
                filter: (c) => {
                    return c.memory.role == 'power_attacker' &&
                            c.memory.extraInfo &&
                            c.memory.extraInfo.powerbank == creep.memory.extraInfo.powerbank;
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