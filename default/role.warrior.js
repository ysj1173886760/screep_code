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

    run: function(creep) {
        if (creep.memory.stage == 'joined') {
            return;
        }
        // first boost
        if (creep.memory.stage == undefined) {
            creep.memory.stage = 'boost';
        }

        if (creep.memory.stage == 'boost') {
            creep.memory.stage = 'waiting';
        }

        // then join the squad
        if (creep.memory.stage == 'waiting') {
            if (Memory.squads) {
                for (let i = 0; i < Memory.squads.length; i++) {
                    if (this.join(creep, Memory.squads[i])) {
                        creep.memory.stage = 'joined';
                        return;
                    }
                }
            }
        }
    }
}