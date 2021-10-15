var {getStructureByFlag} = require('utils');
var roleMiner = 
{

    run: function(creep)
    {
        if(creep.memory.working && creep.store.getUsedCapacity() == 0)
        {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.working = true;
            creep.say('store');
        }
        if(!creep.memory.working)
        {
            let target = creep.room.find(FIND_MINERALS);
            if(target.length > 0)
            {
                if(creep.harvest(target[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target[0]);
                }
                return;
            }
        }
        else
        {
            let target = creep.room.storage;
            if(target)
            {
                for(resource in creep.store)
                {
                    if(creep.transfer(target, resource) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target, {visualizePathStyle: { stoke:  '#ffffff'}});
                    }
                }
                return;
            }
        }
    }
};

module.exports = roleMiner;