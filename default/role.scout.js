var scout = {
    run: function(creep) {
        let flag = Game.flags['scout'];
        if (!flag) {
            return;
        }

        creep.moveTo(flag);
    }
};

module.exports = scout;