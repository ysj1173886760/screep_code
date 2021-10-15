module.exports = {
    run: function(creep)
    {
        if(creep.room.name != creep.memory.targetRoom)
        {
            let flag = Game.flags[`reserve ${creep.memory.targetRoom}`];
            creep.moveTo(flag);
            return;
        }
        var target = creep.room.controller;
        
        if(target.reservation && target.reservation.username != 'heavensheep')
        {
            if(creep.attackController(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target, {reusePath: 50});
            }
            return;
        }
        else
        {
            if(creep.reserveController(target) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target, {reusePath: 50});
            }
            return;
        }
    }
};