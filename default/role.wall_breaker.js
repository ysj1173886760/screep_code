var wall_breaker = {
    run: function(creep) {
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }

        let flag = Game.flags['dismantle'];
        if (!flag) {
            return;
        }
        // G_roomSpawn('wall_breaker', 'E37S58', false, 100, {needBoost: true, boostResource: ['XZH2O']})

        if (creep.pos.roomName != flag.pos.roomName) {
            creep.goTo(flag.pos, 1);
            return;
        }

        let target = flag.pos.lookFor(LOOK_STRUCTURES);

        creep.memory.standed = true;
        if (target.length) {
            if (!creep.pos.inRangeTo(target[0], 1)) {
                creep.goTo(target[0].pos, 1);
            } else {
                creep.dismantle(target[0]);
            }
        }
    }
};

module.exports = wall_breaker;