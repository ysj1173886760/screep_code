var {getStructureByFlag} = require('utils');

var roleOutputer =
{
    run: function(creep)
    {
        if(creep.memory.outputing && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.outputing = false;
            creep.say('harvest');
        }
        if(!creep.memory.outputing && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.outputing = true;
            creep.say('outputing');
        }
        if(creep.memory.outputing)
        {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter:(s) =>
                    {
                        return s.structureType == STRUCTURE_TOWER && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
            }
            else
            {
                let flag = Game.flags[`upgrade_container ${creep.room.name}`];
                target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                    }
                }
            }
        }
        else
        {
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 3);
            if(target.length > 0)
            {
                if(creep.pickup(target[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target[0]);
                }
                return;
            }
            target = creep.room.storage;
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleOutputer;