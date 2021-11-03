var assaulter = {
    run: function(creep) {
        let flag = Game.flags[`attack`];
        if (!flag) {
            let target = creep.room.find(FIND_HOSTILE_CREEPS);
            if (target.length) {
                if (!creep.pos.inRangeTo(target[0], 1)) {
                    creep.goTo(target[0].pos, 1);
                } else {
                    creep.attack(target[0]);
                }
                return;
            }

            target = creep.room.find(FIND_HOSTILE_STRUCTURES);
            if (target.length) {
                if (!creep.pos.inRangeTo(target[0], 1)) {
                    creep.goTo(target[0].pos, 1);
                } else {
                    creep.attack(target[0]);
                }
                return;
            }
            return;
        }

        if (creep.room.name != flag.pos.roomName) {
            creep.moveTo(new RoomPosition(25, 25, flag.pos.roomName));
            return;
        }


        if (!creep.pos.inRangeTo(flag, 3)) {
            creep.moveTo(flag);
        }

        let target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
        if (target.length) {
            if (creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
            return;
        }
        
        // let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        // if (target) {
        //     if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(target);
        //     }
        //     return;
        // }

        target = flag.pos.lookFor(LOOK_STRUCTURES);
        if (target.length) {
            if (creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
        }
    }
}

module.exports = assaulter;