var {getStructureByFlag} = require('utils');

var roleManager = {
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
            creep.say('work');
        }
        let flag = Game.flags[`center ${creep.memory.roomname}`];
        if(!flag)return;
        if(creep.pos.x != flag.pos.x || creep.pos.y != flag.pos.y)
        {
            creep.moveTo(flag.pos.x, flag.pos.y);
            return;
        }
        if(creep.memory.working)
        {
            let target = creep.room.storage;
            if(target)
            {
                for(let resource in creep.store)
                {
                    creep.transfer(target, resource)
                }
            }
        }
        else 
        {
            let link_flag = Game.flags[`link ${creep.room.name}`];
            let target = getStructureByFlag(link_flag, STRUCTURE_LINK);
            if(target && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0)
            {
                creep.withdraw(target, RESOURCE_ENERGY);
                return;
            }

            target = creep.room.terminal;
            if(target)
            {
                for(let resource in target.store)
                {
                    creep.withdraw(target, resource);
                }
                return;
            }
        }
    }
};

module.exports = roleManager;