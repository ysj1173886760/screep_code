var roleHarvester = 
{

    run: function(creep)
    {
        if(creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.harvesting = false;
            creep.say('harvest');
        }
        if(!creep.memory.harvesting && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.harvesting = true;
            creep.say('store');
        }
        if(creep.memory.harvesting)
        {
            if(creep.memory.useLink)
            {
                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_LINK;
                        }
                    });
                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                    }
                }
            }
            else
            {
                let target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                    {
                        filter: (structure) =>
                        {
                            return structure.structureType == STRUCTURE_CONTAINER;
                        }
                    });
                if(target)
                {
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
            }
            
        }
        else
        {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.work_location]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(sources[creep.memory.work_location], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleHarvester;