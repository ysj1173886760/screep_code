var {whiteList} = require('whiteList');

var Tower = {
    run: function(tower) {
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: (c) => {
                return whiteList.indexOf(c.owner.username) > -1;
            }
        });
        if (target) {
            tower.attack(target)
        }
    }
};

module.exports = Tower;