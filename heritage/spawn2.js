var spawn2 = 
{
    run: function()
    {
        var roleList = ['harvester', 'manager', 'mainTransfer', 'outputer', 'upgrader', 'repairer', 'builder', 'miner', 'attacker', 'claimer', 'attacker1', 'claimer1','distant_harvester', 'distant_transfer', 'distant_harvester1', 'distant_transfer1'];
        var roleNumber = [2, 1, 1, 1, 3, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2];
        var location;
        for(let role in roleList)
        {
            let temp = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 80 &&
                                creep.memory.work_location == 0 &&
                                creep.memory.roomname == 'E13N26'));
            if(temp.length < 1)
                location = 0;
            else 
                location = 1;
            let creeps = _.filter(Game.creeps, (creep) => (creep.memory.role == roleList[role] &&
                                creep.ticksToLive > 80 &&
                                creep.memory.roomname == 'E13N26'));
            if(creeps.length < roleNumber[role])
            {
                let newName = roleList[role] + Game.time;
                let result;
                if(roleList[role] == 'harvester')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', work_location: location, useLink: true}});
                }
                if(roleList[role] == 'upgrader')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26'}});
                }
                if(roleList[role] == 'transfer')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', work_location: location}});
                }
                if(roleList[role] == 'manager')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N26'}});
                }
                if(roleList[role] == 'mainTransfer')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N26'}});
                }
                if(roleList[role] == 'outputer')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26'}});
                }
                if(roleList[role] == 'repairer')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26'}});
                }
                if(roleList[role] == 'builder')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], storage: Game.rooms['E13N26'].storage.id, roomname: 'E13N26', targetRoom: 'E13N26'}});
                }
                if(roleList[role] == 'miner')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([WORK, CARRY, MOVE, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N26'}});
                }
                if(roleList[role] == 'attacker')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', targetRoom: 'E13N27'}});
                }
                if(roleList[role] == 'claimer')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([CLAIM, MOVE, CLAIM, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', targetRoom: 'E13N27'}});
                }
                if(roleList[role] == 'attacker1')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', targetRoom: 'E12N26'}});
                }
                if(roleList[role] == 'claimer1')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([CLAIM, MOVE, CLAIM, MOVE], 
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', targetRoom: 'E12N26'}});
                }
                if(roleList[role] == 'distant_harvester')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', targetRoom: 'E13N27'}})
                }
                if(roleList[role] == 'distant_transfer')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', storage: Game.rooms['E13N26'].storage.id, targetRoom: 'E13N27'}})
                }
                if(roleList[role] == 'distant_harvester1')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', targetRoom: 'E12N26'}})
                }
                if(roleList[role] == 'distant_transfer1')
                {
                    result = Game.spawns['Spawn2'].spawnCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
                        newName, {memory: {role: roleList[role], roomname: 'E13N26', storage: Game.rooms['E13N26'].storage.id, targetRoom: 'E12N26'}})
                }
                if(result != undefined && result == OK)
                {
                    console.log(`spawn2 spawning ${newName}`);
                    return;
                }
            }
        }
    }
}

module.exports = spawn2;
