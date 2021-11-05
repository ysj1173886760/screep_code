var slaimer = {
    run: function(creep) {
        let flag = Game.flags['slaim'];
        if (!flag) {
            return;
        }

        creep.heal(creep);
        if (creep.pos.roomName != flag.pos.roomName) {
            creep.goTo(flag.pos, 1);
            return;
        }

        creep.memory.standed = true;
        let target = creep.room.find(FIND_HOSTILE_CREEPS);
        if (target.length) {
            if (creep.pos.inRangeTo(target[0], 3)) {
                creep.rangedAttack(target[0]);
            } else {
                creep.goTo(target[0].pos, 3);
            }
            return;
        }

        target = creep.room.find(FIND_HOSTILE_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN || 
                        s.structureType == STRUCTURE_TOWER;
            }
        });
        if (target.length) {
            if (!creep.pos.inRangeTo(target[0], 3)) {
                creep.goTo(target[0].pos, 3);
            } else {
                creep.rangedAttack(target[0]);
            }
            return;
        }

        creep.goTo(flag.pos, 1);
    }
};

module.exports = slaimer;