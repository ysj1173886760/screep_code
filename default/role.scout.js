var scout = {
    run: function(creep) {
        let flag = Game.flags['scout'];
        if (!flag) {
            return;
        }

        creep.goTo(flag.pos, 1);
    }
};

module.exports = scout;