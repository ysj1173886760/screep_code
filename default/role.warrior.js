module.exports = {
    join: function(creep, squad) {
        for (let i = 0; i < squad.creeps.length; i++) {
            if (creep.memory.role == squad.creeps[i]) {
                squad.creeps[i] = creep.id;
                return true;
            }
        }

        return false;
    },

    healer: function(creep) {
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }

        let creeps = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => {
                return c.hits < c.hitsMax;
            }
        });
        if (creeps.length == 0) {
            return;
        }

        if (!creep.pos.inRangeTo(creeps[0], 1)) {
            creep.goTo(creeps[0].pos, 1);
            return;
        } else {
            let heal1 = creep.hitsMax - creep.hits;
            let heal2 = creeps[0].hitsMax - creeps[0].hits;
            if (heal1 < heal2) {
                creep.heal(creeps[0]);
            } else {
                creep.heal(creep);
            }
        }
    },

    attacker: function(creep) {
        let creeps = creep.room.find(FIND_HOSTILE_CREEPS);
        if (creeps.length > 0) {
            if (!creep.pos.inRangeTo(creeps[0], 1)) {
                creep.goTo(creeps[0].pos, 1);
            } else {
                creep.attack(creeps[0]);
            }
            return;
        }

        let structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if (structures.length > 0) {
            if (!creep.pos.inRangeTo(structures[0], 1)) {
                creep.goTo(structures[0].pos, 1);
            } else {
                creep.attack(structures[0]);
            }
            return;
        }
    },

    run: function(creep) {
        if (creep.memory.stage == 'serve') {
            return;
        }

        if (creep.memory.stage == 'retire') {
            if (creep.memory.role == 'healer') {
                this.healer(creep);
            } else if (creep.memory.role == 'attacker') {
                this.attacker(creep);
            }
            return;
        }

        if (creep.memory.stage == undefined) {
            creep.memory.stage = 'waiting';
        }

        // first join the squad
        if (creep.memory.stage == 'waiting') {
            if (creep.ticksToLive < 1450) {
                creep.renewMe();
            }
            if (Memory.squads) {
                for (let i = 0; i < Memory.squads.length; i++) {
                    if (this.join(creep, Memory.squads[i])) {
                        creep.memory.stage = 'joined';
                        return;
                    }
                }
            }
        }

        // then boost
        if (creep.memory.stage == 'boost') {
            if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
                if ((creep.memory.boostStage == 'init' || creep.memory.boostStage == 'wait') && creep.ticksToLive < 1400) {
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
            } else {
                creep.memory.stage = 'serve';
            }
        }

    }
}