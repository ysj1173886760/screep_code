module.exports = {
    run: function(creep)
    {
        if(!creep.memory.working && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.working = true;
            creep.say('upgrading');
        }
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.working = false;
            creep.say('harvest');
        }
        if(!creep.memory.working)
        {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.work_location]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(sources[creep.memory.work_location], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else
        {
            let target = creep.room.find(FIND_MY_STRUCTURES, 
                {
                    filter: (s) => 
                    {
                        return ((s.structureType == STRUCTURE_SPAWN || 
                            s.structureType == STRUCTURE_EXTENSION ||
                            s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                    }
                });
            if(target.length > 0)
            {
                if(creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target[0]);
                }
                return;
            }
            
            target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter:(s) =>
                    {
                        return (s.structureType == STRUCTURE_ROAD ||
                                s.structureType == STRUCTURE_CONTAINER ||
                                s.structureType == STRUCTURE_TOWER) && (s.hits < s.hitsMax);
                    }
                });
            if(target)
            {
                if(creep.repair(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }
            
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};