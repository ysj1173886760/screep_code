var {getStructureByFlag} = require('utils');

var roleHarvester = {
    run: function(creep) {

        if (creep.memory.positioned && creep.memory.working_source != undefined) {
            let resource = Game.getObjectById(creep.memory.working_source);
            creep.exHarvest(resource);
            return;
        }

        let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

        if (!creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag);
            return;
        }

        creep.memory.positioned = true;
        target = flag.pos.findClosestByPath(FIND_SOURCES);
        creep.memory.working_source = target.id;

    }
};

module.exports = roleHarvester;