var {getStructureByFlag} = require('utils');

var roleMainTransfer =
{
    run: function(creep)
    {
        if(creep.memory.transfering && creep.store.getUsedCapacity() == 0)
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
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (s) =>
                    {
                        return (s.structureType == STRUCTURE_EXTENSION ||
                                s.structureType == STRUCTURE_SPAWN) &&
                                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
                return;
            }

            target = creep.pos.findClosestByPath(FIND_STRUCTURES,
                {
                    filter: (s) =>
                    {
                        return s.structureType == STRUCTURE_TOWER &&
                                s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
                return;
            }

            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if(target)
            {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
                return;
            }
        }
        else
        {
            let flag = Game.flags[`container 0 ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if(target && target.store.getUsedCapacity() >= 700)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return;
            }

            flag = Game.flags[`container 1 ${creep.room.name}`];
            target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if(target && target.store.getUsedCapacity() >= 700)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target);
                }
                return;
            }

            target = creep.room.storage;
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

module.exports = roleMainTransfer;