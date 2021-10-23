var {
    squadMove
} = require('warframe');

module.exports = {
    jobs: ['attacker', 'healer'],

    run: function(squad) {
        if (squad.stage == undefined) {
            squad.stage = 'prepare';
            squad.creeps = ['attacker', 'attacker', 'healer', 'healer'];
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
                
            squad.stage = 'teamup';
        }

        if (squad.stage == 'teamup') {
            let creep0 = squad.creeps[0];
            let creep1 = squad.creeps[1];
            let creep2 = squad.creeps[2];
            let creep3 = squad.creeps[3];

            if (creep0.pos.x == creep1.pos.x - 1 && creep0.pos.y == creep1.pos.y &&
                creep0.pos.x == creep2.pos.x && creep0.pos.y == creep2.pos.y - 1 &&
                creep0.pos.x == creep3.pos.x - 1 && creep0.pos.y == creep3.pos.y - 1) {
                squad.stage = 'battle';
                squad.direction = TOP;
                return;
            }

            let flag = Game.flags['t'];
            if (flag) {
                creep0.moveTo(flag.pos.x, flag.pos.y);
                creep1.moveTo(flag.pos.x + 1, flag.pos.y);
                creep2.moveTo(flag.pos.x, flag.pos.y + 1);
                creep3.moveTo(flag.pos.x + 1, flag.pos.y + 1);
            }
        }

        if (squad.stage == 'battle') {
            let flag = Game.flags['t'];
            squadMove(squad, flag.pos);
        }

    }
}