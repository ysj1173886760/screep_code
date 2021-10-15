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
}

module.exports = roleUpgrader;