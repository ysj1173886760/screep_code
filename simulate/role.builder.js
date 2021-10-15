var roleUpgrader = require('role.upgrader');

var roleBuilder = 
{

    run: function(creep)
    {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.building = true;
            creep.say('build');
        }

        if(creep.memory.building)
        {
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target)
            {
                if(creep.build(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
            }
            else 
            {
                roleUpgrader.run(creep);
            }
        }
        else
        {
            let target = Game.getObjectById('5eff4fa28e0c8c790e3e5441');
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;