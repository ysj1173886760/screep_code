var {getStructureByFlag} = require('utils');
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
            
            // let target = creep.room.storage;
            // if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
            // {
            //     creep.moveTo(target);
            // }
            /*let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target)
            {
                if(creep.build(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }*/
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES,
                {
                    filter:(s) =>
                    {
                        return ((s.structureType == STRUCTURE_ROAD ||
                                s.structureType == STRUCTURE_CONTAINER ||
                                s.structureType == STRUCTURE_TOWER) && (s.hits < s.hitsMax)) ||
                                (s.structureType == STRUCTURE_WALL && s.hits < 5000);
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
            if(creep.room.name != 'E12N25')
            {
                let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
                if(target)
                {
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                    return;
                }
                target = creep.pos.findClosestByPath(FIND_TOMBSTONES);
                if(target && target.store.getUsedCapacity() > 0)
                {
                    for(let resource in target.store)
                    {
                        if(creep.withdraw(target, resource) == ERR_NOT_IN_RANGE)
                        {
                            creep.moveTo(target);
                        }
                    }
                    return;
                }
            }
            target = creep.room.storage;
            if(target && creep.store[RESOURCE_ENERGY] == 0 && creep.store.getUsedCapacity() != 0)
            {
                for(let resource in creep.store)
                {
                    if(creep.transfer(target, resource) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(target);
                    }
                }
                return;
            }
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            } 
        }
    }
};

module.exports = roleRepairer;