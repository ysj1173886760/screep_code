var roleUpgrader = require('role.upgrader');
var roleRepairer = 
{
    run: function(creep)
    {
        if(!creep.memory.repairing && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0)
        {
            creep.memory.repairing = true;
            creep.say('repairing');
        }
        if(creep.memory.repairing && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.repairing = false;
            creep.say('harvesting');
        }
        if(creep.memory.repairing)
        {
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter:(s) =>
                    {
                        return (s.hits < s.hitsMax - 200 && s.structureType == STRUCTURE_ROAD) ||
                                (s.hits < s.hitsMax && s.structureType == STRUCTURE_TOWER);
                    }
                });
            if(target)
            {
                if(creep.repair(target) == ERR_NOT_IN_RANGE)
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

module.exports = roleRepairer;