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
        // G_roomSpawn('wall_breaker', 'E37S58', false, 100, {needBoost: true, boostResource: ['XZH2O', 'XZHO2']})

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
            return;
        }
        
        target = creep.room.find(FIND_HOSTILE_SPAWNS);
        if (target.length) {
            if (!creep.pos.inRangeTo(target[0], 1)) {
                creep.goTo(target[0].pos, 1);
            } else {
                creep.dismantle(target[0]);
            }
            return;
        }

        target = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_TOWER;
            }
        });
        if (target.length) {
            if (!creep.pos.inRangeTo(target[0], 1)) {
                creep.goTo(target[0].pos, 1);
            } else {
                creep.dismantle(target[0]);
            }
            return;
        }

        creep.goTo(flag.pos, 1);
    }
};

module.exports = wall_breaker;