var spawn1 = 
{
    run: function()
    {
        var roleList = ['harvester', 'upgrader', 'builder', 'repairer'];
        var roleNumber = [4, 2, 3, 1];
        var location;
        for(let role in roleList)
        {
            let temp = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 60 &&
                                creep.memory.work_location == 0));
            if(temp.length < 2)
                location = 0;
            else 
                location = 1;
            let creeps = _.filter(Game.creeps, (creep) => ((creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 60)));
            if(creeps.length < roleNumber[role])
            {
                let newName = roleList[role] + Game.time;
                if(roleList[role] == 'upgrader')
                {
                    Game.spawns['Spawn1'].spawnCreep([CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE], newName, {memory: {role: roleList[role], work_location: location}});
                }
                if(roleList[role] == 'builder')
                {
                    Game.spawns['Spawn1'].spawnCreep([CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE], newName, {memory: {role: roleList[role], work_location: location}});
                }
                if(roleList[role] == 'harvester')
                {
                    Game.spawns['Spawn1'].spawnCreep([CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE], newName, {memory: {role: roleList[role], work_location: location}});
                }
                if(roleList[role] == 'repairer')
                {
                    Game.spawns['Spawn1'].spawnCreep([CARRY, WORK, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE], newName, {memory: {role: roleList[role], work_location: location}});
                }
            }
        }
    }
}

module.exports = spawn1;