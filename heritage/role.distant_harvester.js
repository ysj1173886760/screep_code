module.exports = {
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

        if(!creep.memory.harvesting)
        {
            if(creep.room.name != creep.memory.targetRoom)
            {
                let flag = Game.flags[`reserve ${creep.memory.targetRoom}`];
                creep.moveTo(flag);
                return;
            }

            let resources = creep.room.find(FIND_SOURCES);
            if(resources.length > 0)
            {
                if(creep.harvest(resources[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(resources[0]);
                }
                return;
            }
        }
        else
        {
            //先建造
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target)
            {
                if(creep.build(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return;
            }

            //修复
            target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter:(s) =>
                    {
                        return (s.structureType == STRUCTURE_CONTAINER
                                 && (s.hits < s.hitsMax))
                    }
                });
            if(target)
            {
                if(creep.repair(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return;
            }

            //放箱子里
            target = creep.pos.findClosestByPath(FIND_STRUCTURES, 
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
};