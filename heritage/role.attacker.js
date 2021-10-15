module.exports = {
    run: function(creep)
    {
        let flag = Game.flags[`reserve ${creep.memory.targetRoom}`];
        if(creep.room.name != creep.memory.targetRoom)
        {
            creep.moveTo(flag);
            return;
        }
        target = creep.room.find(FIND_HOSTILE_CREEPS);
        if(target.length > 0)
        {
            if(creep.attack(target[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target[0]);
            }
            return;
        }

        target = creep.room.find(FIND_HOSTILE_STRUCTURES);
        if(target.length > 0)
        {
            if(creep.attack(target[0]) == ERR_NOT_IN_RANGE)
            {
                creep.moveTo(target[0]);
            }
            return;
        }

        creep.moveTo(flag);
    }
};