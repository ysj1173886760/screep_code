var superWarrior = {
    run: function(creep) {
        // G_roomSpawn('superWarrior', 'E37S58', false, 100, {needBoost: true, boostResource: ['XGHO2', 'XLHO2', 'XKHO2', 'XZHO2']})
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            if ((creep.memory.boostStage == 'init' || creep.memory.boostStage == 'wait') && creep.ticksToLive < 1450) {
                creep.renewMe();
                return;
            }
            if (creep.memory.boostStage == undefined) {
                let room = creep.room;
                if (room.memory.boostController.enabled == false) {
                    creep.memory.boosted = true;
                    return;
                }
                creep.memory.boostStage = 'init';
                return;
            } 

            if (creep.memory.boostStage == 'init') {
                let task = {
                    boostResource: creep.memory.extraInfo.boostResource,
                    id: creep.id,
                };
                let room = creep.room
                
                room.memory.boostController.boostQueue.push(task);
                creep.memory.boostStage = 'wait';
            }
            

            if (creep.memory.boostStage == 'wait') {
                return;
            }

            if (creep.memory.boostStage == 'prepared') {
                return;
            }

            if (creep.memory.boostStage == 'failed') {
                creep.memory.extraInfo.needBoost = false;
                creep.memory.boosted = true;
            }

            if (creep.memory.boostStage == 'ok') {
                creep.memory.boosted = true;
            }
            return;
        }

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }

        let flag = Game.flags['attack'];
        if (!flag) {
            creep.say('destroy');
            let target = creep.room.find(FIND_HOSTILE_CREEPS);
            if (target.length) {
                if (!creep.pos.inRangeTo(target[0], 3)) {
                    creep.goTo(target[0].pos, 3);
                } else {
                    creep.rangedAttack(target[0]);
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
            return;
        }
        if (creep.room.name != flag.pos.roomName) {
            creep.goTo(new RoomPosition(25, 25, flag.pos.roomName), 20);
            return;
        }

        let target = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (target.length) {
            creep.rangedAttack(target[0]);
            return;
        }

        if (!creep.pos.inRangeTo(flag, 3)) {
            creep.goTo(flag.pos, 0);
        }

        target = flag.pos.lookFor(LOOK_STRUCTURES);
        if (target.length) {
            if (!creep.pos.inRangeTo(target[0], 3)) {
                creep.goTo(target[0].pos, 2);
                return;
            }
            creep.rangedAttack(target[0]);
        }

    }
};

module.exports = superWarrior;