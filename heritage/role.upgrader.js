var {getStructureByFlag} = require('utils');

var roleUpgrader = 
{

    run: function(creep)
    {
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.upgrading = false;
            creep.say('harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.upgrading = true;
            creep.say('upgrade');
        }
        if(creep.memory.upgrading)
        {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else
        {
            //let target = creep.room.storage;
            let flag = Game.flags[`upgrade_container ${creep.room.name}`];
            let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }
            
            target = creep.room.storage;
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
}

module.exports = roleUpgrader;