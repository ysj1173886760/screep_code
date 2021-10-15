var Tower = {
    run: function(tower) {
        let target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target)
        }
    }
};

module.exports = Tower;