var spawn1 = 
{
    run: function()
    {
        var roleList = ['harvester', 'manager', 'mainTransfer', 'upgrader', 'outputer', 'builder', 'repairer', 'miner', 'attacker', 'claimer', 'distant_harvester', 'distant_transfer'];
        var roleNumber = [2, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1];
        var location;
        for(let role in roleList)
        {
            let temp = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 80 &&
                                creep.memory.work_location == 0 && 
                                creep.memory.roomname == 'E13N25'));
            if(temp.length < 1)
                location = 0;
            else 
                location = 1;
            let creeps = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 80 &&
                                creep.memory.roomname == 'E13N25'));
            if(creeps.length < roleNumber[role])
            {
                let newName = roleList[role] + Game.time;
                let result;
                if(roleList[role] == 'upgrader')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25'}});
                }
                if(roleList[role] == 'builder')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], storage: Game.rooms['E13N25'].storage.id, roomname: 'E13N25', targetRoom: 'E13N25'}});
                }
                if(roleList[role] == 'harvester')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY], 
                        newName, {memory: {role: roleList[role], work_location: location, roomname: 'E13N25', useLink: true}});
                }
                if(roleList[role] == 'repairer')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25'}});
                }
                if(roleList[role] == 'transfer')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], work_location: location, roomname: 'E13N25'}});
                }
                if(roleList[role] == 'mainTransfer')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25'}});
                }
                if(roleList[role] == 'outputer')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25'}});
                }
                if(roleList[role] == 'attacker')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N25', targetRoom: 'E13N24'}});
                }
                if(roleList[role] == 'claimer')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE, CLAIM, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25', targetRoom: 'E13N24'}});
                }
                if(roleList[role] == 'miner')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25'}});
                }
                if(roleList[role] == 'manager')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N25'}});
                }
                if(roleList[role] == 'distant_harvester')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
                        newName, {memory: {role: roleList[role], roomname: 'E13N25', targetRoom: 'E13N24'}})
                }
                if(roleList[role] == 'distant_transfer')
                {
                    result = Game.spawns['Spawn1'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY],
                        newName, {memory: {role: roleList[role], roomname: 'E13N25', targetRoom: 'E13N24', storage: Game.rooms['E13N25'].storage.id}})
                }
                if(result != undefined && result == OK)
                {
                    console.log(`spawn1 spawning ${newName}`);
                    return;
                }
            }
        }
    }
}

module.exports = spawn1;

// Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE], 
//     'sheep01', {memory: {role: 'claimer', roomname: 'E13N26'}});