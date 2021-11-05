var {
    squadMove,
    leftShift,
    checkSquad,
    turnLeft
} = require('warframe');

module.exports = {
    jobs: ['attacker', 'healer'],

    // G_roomSpawn('attacker', 'W7N4', false, 100, {needBoost: true, boostResource: ['XUH2O', 'XGHO2', 'XZHO2']})
    // G_roomSpawn('healer', 'W7N4', false, 100, {needBoost: true, boostResource: ['XLHO2', 'XGHO2', 'XZHO2']})
    run: function(squad) {
        if (squad.stage == undefined) {
            squad.stage = 'prepare';
            squad.creeps = ['attacker', 'attacker', 'healer', 'healer'];
        }

        if (squad.stage == 'dismissed') {
            delete squad;
            return;
        }
        // prepare stage, find the warrior to join the squad
        if (squad.stage == 'prepare') {
            let res = true;
            for (let i = 0; i < this.jobs.length; i++) {
                if (squad.creeps.indexOf(this.jobs[i]) != -1) {
                    res = false;
                }
            }
            if (!res) {
                return;
            }
                
            squad.stage = 'prepare_boost';
        }

        if (squad.stage == 'prepare_boost') {
            let creep0 = Game.getObjectById(squad.creeps[0]);
            let creep1 = Game.getObjectById(squad.creeps[1]);
            let creep2 = Game.getObjectById(squad.creeps[2]);
            let creep3 = Game.getObjectById(squad.creeps[3]);
            if (creep0) {
                creep0.memory.stage = 'boost';
            }
            if (creep1) {
                creep1.memory.stage = 'boost';
            }
            if (creep2) {
                creep2.memory.stage = 'boost';
            }
            if (creep3) {
                creep3.memory.stage = 'boost';
            }
            squad.stage = 'wait_boost';
        }

        if (squad.stage == 'wait_boost') {
            let creep0 = Game.getObjectById(squad.creeps[0]);
            let creep1 = Game.getObjectById(squad.creeps[1]);
            let creep2 = Game.getObjectById(squad.creeps[2]);
            let creep3 = Game.getObjectById(squad.creeps[3]);

            let flag = Game.flags['t'];
            if (flag) {
                let res = true;
                if (creep0) {
                    if (creep0.memory.stage == 'serve') {
                        creep0.goTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), 0);
                    } else {
                        res = false;
                    }
                }
                if (creep1) {
                    if (creep1.memory.stage == 'serve') {
                        creep1.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y, flag.pos.roomName), 0);
                    } else {
                        res = false;
                    }
                }
                if (creep2) {
                    if (creep2.memory.stage == 'serve') {
                        creep2.goTo(new RoomPosition(flag.pos.x, flag.pos.y + 1, flag.pos.roomName), 0);
                    } else {
                        res = false;
                    }
                }
                if (creep3) {
                    if (creep3.memory.stage == 'serve') {
                        creep3.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y + 1, flag.pos.roomName), 0);
                    } else {
                        res = false;
                    }
                }
                if (!res) {
                    return;
                }
            } else {
                if (creep0 && creep0.memory.stage != 'serve') {
                    return;
                }
                if (creep1 && creep1.memory.stage != 'serve') {
                    return;
                }
                if (creep2 && creep2.memory.stage != 'serve') {
                    return;
                }
                if (creep3 && creep3.memory.stage != 'serve') {
                    return;
                }
            }

            squad.stage = 'teamup';
        }

        if (squad.stage == 'teamup') {
            let creep0 = Game.getObjectById(squad.creeps[0]);
            let creep1 = Game.getObjectById(squad.creeps[1]);
            let creep2 = Game.getObjectById(squad.creeps[2]);
            let creep3 = Game.getObjectById(squad.creeps[3]);

            if (!creep0 || !creep1 || !creep2 || !creep3) {
                if (creep0) {
                    creep0.memory.stage = 'retire';
                }
                if (creep1) {
                    creep1.memory.stage = 'retire';
                }
                if (creep2) {
                    creep2.memory.stage = 'retire';
                }
                if (creep3) {
                    creep3.memory.stage = 'retire';
                }
                squad.stage = 'dismissed';
                return;
            }
            creep0.memory.standed = true;
            creep1.memory.standed = true;
            creep2.memory.standed = true;
            creep3.memory.standed = true;
            
            if (creep0.pos.x == creep1.pos.x - 1 && creep0.pos.y == creep1.pos.y &&
                creep0.pos.x == creep2.pos.x && creep0.pos.y == creep2.pos.y - 1 &&
                creep0.pos.x == creep3.pos.x - 1 && creep0.pos.y == creep3.pos.y - 1) {

                creep0.memory.standed = true;
                creep1.memory.standed = true;
                creep2.memory.standed = true;
                creep3.memory.standed = true;

                squad.stage = 'battle';
                squad.direction = TOP;
                return;
            }

            let flag = Game.flags['t'];
            if (flag) {
                creep0.goTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), 0);
                creep1.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y, flag.pos.roomName), 0);
                creep2.goTo(new RoomPosition(flag.pos.x, flag.pos.y + 1, flag.pos.roomName), 0);
                creep3.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y + 1, flag.pos.roomName), 0);

                // creep0.moveTo(flag.pos.x, flag.pos.y);
                // creep1.moveTo(flag.pos.x + 1, flag.pos.y);
                // creep2.moveTo(flag.pos.x, flag.pos.y + 1);
                // creep3.moveTo(flag.pos.x + 1, flag.pos.y + 1);
            }
        }

        if (squad.stage == 'regroup') {
            let creep0 = Game.getObjectById(squad.creeps[0]);
            let creep1 = Game.getObjectById(squad.creeps[1]);
            let creep2 = Game.getObjectById(squad.creeps[2]);
            let creep3 = Game.getObjectById(squad.creeps[3]);

            if (!creep0 || !creep1 || !creep2 || !creep3) {
                if (creep0) {
                    creep0.memory.stage = 'retire';
                }
                if (creep1) {
                    creep1.memory.stage = 'retire';
                }
                if (creep2) {
                    creep2.memory.stage = 'retire';
                }
                if (creep3) {
                    creep3.memory.stage = 'retire';
                }
                squad.stage = 'dismissed';
                return;
            }
            
            let flag = Game.flags['regroup'];
            let res = false;
            switch(squad.direction) {
            case TOP:
                if (creep0.pos.x == creep1.pos.x - 1 && creep0.pos.y == creep1.pos.y &&
                    creep0.pos.x == creep2.pos.x && creep0.pos.y == creep2.pos.y - 1 &&
                    creep0.pos.x == creep3.pos.x - 1 && creep0.pos.y == creep3.pos.y - 1 &&
                    creep0.pos.x == flag.pos.x && creep0.pos.y == flag.pos.y) {
                    res = true;
                }
                break;
            case LEFT:
                // 1 3
                // 0 2
                if (creep0.pos.x == creep1.pos.x && creep0.pos.y == creep1.pos.y + 1 &&
                    creep0.pos.x == creep2.pos.x - 1 && creep0.pos.y == creep2.pos.y &&
                    creep0.pos.x == creep3.pos.x - 1 && creep0.pos.y == creep3.pos.y + 1 &&
                    creep0.pos.x == flag.pos.x && creep0.pos.y == flag.pos.y) {
                    res = true;
                }
                break;
            case BOTTOM:
                // 3 2
                // 1 0
                if (creep0.pos.x == creep1.pos.x + 1 && creep0.pos.y == creep1.pos.y &&
                    creep0.pos.x == creep2.pos.x && creep0.pos.y == creep2.pos.y + 1 &&
                    creep0.pos.x == creep3.pos.x + 1 && creep0.pos.y == creep3.pos.y + 1 &&
                    creep0.pos.x == flag.pos.x && creep0.pos.y == flag.pos.y) {
                    res = true;
                }
                break;
            case RIGHT:
                // 2 0
                // 3 1
                if (creep0.pos.x == creep1.pos.x && creep0.pos.y == creep1.pos.y - 1 &&
                    creep0.pos.x == creep2.pos.x + 1 && creep0.pos.y == creep2.pos.y &&
                    creep0.pos.x == creep3.pos.x + 1 && creep0.pos.y == creep3.pos.y - 1 &&
                    creep0.pos.x == flag.pos.x && creep0.pos.y == flag.pos.y) {
                    res = true;
                }
            }

            let target = creep2.pos.findInRange(FIND_MY_CREEPS, {
                filter: (c) => {
                    return c.hits < c.hitsMax;
                }
            });
            if (target.length) {
                creep2.heal(target[0]);
            }

            target = creep3.pos.findInRange(FIND_MY_CREEPS, {
                filter: (c) => {
                    return c.hits < c.hitsMax;
                }
            });
            if (target.length) {
                creep3.heal(target[0]);
            }

            if (res) {
                flag = Game.flags['regroup'];
                flag.remove();
                squad.stage = 'battle';
                return;
            }

            flag = Game.flags['regroup'];
            if (flag) {
                switch (squad.direction) {
                case TOP:
                    creep0.goTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), 0);
                    creep1.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y, flag.pos.roomName), 0);
                    creep2.goTo(new RoomPosition(flag.pos.x, flag.pos.y + 1, flag.pos.roomName), 0);
                    creep3.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y + 1, flag.pos.roomName), 0);
                    break;
                case LEFT:
                    // 1 3
                    // 0 2
                    creep0.goTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), 0);
                    creep1.goTo(new RoomPosition(flag.pos.x, flag.pos.y - 1, flag.pos.roomName), 0);
                    creep2.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y, flag.pos.roomName), 0);
                    creep3.goTo(new RoomPosition(flag.pos.x + 1, flag.pos.y - 1, flag.pos.roomName), 0);
                    break;
                case BOTTOM:
                    // 3 2
                    // 1 0
                    creep0.goTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), 0);
                    creep1.goTo(new RoomPosition(flag.pos.x - 1, flag.pos.y, flag.pos.roomName), 0);
                    creep2.goTo(new RoomPosition(flag.pos.x, flag.pos.y - 1, flag.pos.roomName), 0);
                    creep3.goTo(new RoomPosition(flag.pos.x - 1, flag.pos.y - 1, flag.pos.roomName), 0);
                    break;
                case RIGHT:
                    // 2 0
                    // 3 1
                    creep0.goTo(new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName), 0);
                    creep1.goTo(new RoomPosition(flag.pos.x, flag.pos.y + 1, flag.pos.roomName), 0);
                    creep2.goTo(new RoomPosition(flag.pos.x - 1, flag.pos.y, flag.pos.roomName), 0);
                    creep3.goTo(new RoomPosition(flag.pos.x - 1, flag.pos.y + 1, flag.pos.roomName), 0);
                    break;
                }
                // creep0.moveTo(flag.pos.x, flag.pos.y);
                // creep1.moveTo(flag.pos.x + 1, flag.pos.y);
                // creep2.moveTo(flag.pos.x, flag.pos.y + 1);
                // creep3.moveTo(flag.pos.x + 1, flag.pos.y + 1);
            }
        }

        if (squad.stage == 'battle') {
            let flag = Game.flags['regroup'];
            if (flag) {
                squad.stage = 'regroup';
                delete squad.path;
                return;
            }

            flag = Game.flags['attack'];
            if (!flag) {
                return;
            }

            let creep0 = Game.getObjectById(squad.creeps[0]);
            let creep1 = Game.getObjectById(squad.creeps[1]);
            let creep2 = Game.getObjectById(squad.creeps[2]);
            let creep3 = Game.getObjectById(squad.creeps[3]);

            if (!creep0 || !creep1 || !creep2 || !creep3) {
                if (creep0) {
                    creep0.memory.stage = 'retire';
                }
                if (creep1) {
                    creep1.memory.stage = 'retire';
                }
                if (creep2) {
                    creep2.memory.stage = 'retire';
                }
                if (creep3) {
                    creep3.memory.stage = 'retire';
                }
                squad.stage = 'dismissed';
                return;
            }

            // check squad
            if (!checkSquad(squad)) {
                creep0.pos.createFlag('regroup');
                creep0.say('regroup');
                squad.stage = 'regroup';
                return;
            }

            let damage = [];
            damage.push({
                num: creep0.hitsMax - creep0.hits,
                id: creep0.id,
            });
            damage.push({
                num: creep1.hitsMax - creep1.hits,
                id: creep1.id,
            });
            damage.push({
                num: creep2.hitsMax - creep2.hits,
                id: creep2.id,
            });
            damage.push({
                num: creep3.hitsMax - creep3.hits,
                id: creep3.id,
            });

            damage.sort((a, b) => (b.num - a.num));
            let num1 = creep2.getActiveBodyparts(HEAL) * 12 * 4;
            creep2.heal(Game.getObjectById(damage[0].id));
            if (damage[1].num > damage[0].num - num1) {
                creep3.heal(Game.getObjectById(damage[1].id));
            } else {
                creep3.heal(Game.getObjectById(damage[0].id));
            }

            let arbitaryFlag = Game.flags['arbitary'];

            if (arbitaryFlag) {
                let hostile = creep0.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                if (hostile.length > 0) {
                    if (!creep1.pos.inRangeTo(hostile[0], 1)) {
                        leftShift(squad);
                    }
                    creep0.attack(hostile[0]);
                    creep1.attack(hostile[0]);
                }
                target = creep0.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
                if (target) {
                    if (!creep0.pos.inRangeTo(target, 1)) {
                        squadMove(squad, target);
                        return;
                    }
                    if (!creep1.pos.inRangeTo(target, 1)) {
                        turnLeft(squad);
                    }
                    creep1.attack(target);
                    creep0.attack(target);
                }
            } else {
                if (!creep0.pos.inRangeTo(flag.pos, 1)) {
                    squadMove(squad, flag.pos);
                    let hostile = creep0.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if (hostile.length) {
                        creep0.attack(hostile[0]);
                    }
                    hostile = creep1.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                    if (hostile.length) {
                        creep1.attack(hostile[0]);
                    }

                    return;
                }

                let hostile = creep0.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                if (hostile.length > 0) {
                    if (!creep1.pos.inRangeTo(hostile[0], 1)) {
                        leftShift(squad);
                    }
                    creep0.attack(hostile[0]);
                    creep1.attack(hostile[0]);
                    return;
                }
                target = flag.pos.lookFor(LOOK_STRUCTURES);
                if (target.length) {
                    if (!creep0.pos.inRangeTo(target[0], 1)) {
                        squadMove(squad, target[0]);
                        return;
                    }
                    if (!creep1.pos.inRangeTo(target[0], 1)) {
                        turnLeft(squad);
                    }
                    creep1.attack(target[0]);
                    creep0.attack(target[0]);
                }
            }

        }

    }
}