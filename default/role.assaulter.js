var assaulter = {
    run: function(creep) {
        let flag = Game.flags[`attack`];
        if (!flag) {
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