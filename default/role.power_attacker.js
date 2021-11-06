var power_attacker = {
    run: function(creep) {
        // creep.memory.extraInfo.boostResource = ['XUH2O'];
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

        creep.memory.standed = true;

        let powerbank = Game.getObjectById(creep.memory.extraInfo.powerbank);
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