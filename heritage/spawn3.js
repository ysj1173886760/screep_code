var spawn3 = 
{
    run: function()
    {
        var roleList = ['harvester', 'transfer', 'manager', 'upgrader', 'worker', 'builder', 'repairer'];
        var roleNumber = [2, 1, 1, 2, 0, 0, 1];
        var location;
        for(let role in roleList)
        {
            let temp = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 100 &&
                                creep.memory.work_location == 0 &&
                                creep.memory.roomname == 'E12N25'));
            if(temp.length < 1)
                location = 0;
            else 
                location = 1;
            let creeps = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 100 &&
                                creep.memory.roomname == 'E12N25'));
            //if(roleList[role] == 'transfer')console.log(creeps.length);
            if(creeps.length < roleNumber[role])
            {
                let newName = roleList[role] + Game.time;
                let result;
                if(roleList[role] == 'worker')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([WORK, CARRY, MOVE, WORK, CARRY, MOVE],
                        newName, {memory: {role: 'worker', roomname: 'E12N25', work_location: 1}});
                }
                if(roleList[role] == 'harvester')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E12N25', work_location: location, useLink: (location == 1)}});
                }
                if(roleList[role] == 'transfer')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E12N25', work_location: location}});
                }
                if(roleList[role] == 'upgrader')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E12N25'}});
                }
                if(roleList[role] == 'builder')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], storage: Game.rooms['E12N25'].storage.id, roomname: 'E12N25', targetRoom: 'E12N25'}});
                }
                if(roleList[role] == 'repairer')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([WORK, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E12N25'}});
                }
                if(roleList[role] == 'manager')
                {
                    result = Game.spawns['Spawn3'].spawnCreep([CARRY, CARRY, CARRY, CARRY, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E12N25'}});
                }
                if(result != undefined && result == OK)
                {
                    console.log(`spawn3 spawning ${newName}`);
                    return;
                }
            }
        }
    }
}

module.exports = spawn3;
