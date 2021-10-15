module.exports = {
    run: function(creep)
    {
        if(creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.transfering = false;
            creep.say('harvest');
        }
        if(!creep.memory.transfering && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.transfering = true;
            creep.say('transfer');
        }

        if(creep.memory.transfering)
        {
            let target = Game.getObjectById(creep.memory.storage);
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return;
            }
        }
        else
        {
            if(creep.room.name != creep.memory.targetRoom)
            {
                let flag = Game.flags[`reserve ${creep.memory.targetRoom}`];
                creep.moveTo(flag);
                return;
            }

            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
                {
                    filter: (structure) =>
                    {
                        return structure.structureType == STRUCTURE_CONTAINER;
                    }
                });
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return;
            }
        }
    }
};