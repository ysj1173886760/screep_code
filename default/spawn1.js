var spawn1 = {
    run: function() {
        
    },

    spawn: function(role, roomname, isNeeded, extraInfo) {
        let newName = role + Game.time;
        let result;
        let component = {
            worker: [WORK, WORK, MOVE, CARRY, CARRY, MOVE],
            harvester: [WORK, WORK, WORK, WORK, WORK, CARRY, MOVE],
            transfer: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY],
            builder: [WORK, WORK, MOVE, CARRY, MOVE, CARRY],
            distant_worker: [WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
            repairer: [WORK, WORK, MOVE, CARRY, CARRY, MOVE],
            upgrader: [WORK, WORK, WORK, MOVE, CARRY]
        };
        result = Game.spawns['Spawn1'].spawnCreep(component[role], 
            newName, {memory: {role: role, roomname: roomname, isNeeded: isNeeded, spawn: 'Spawn1', extraInfo: extraInfo}});

        if (result == OK) {
            console.log(`spawn1 spawning ${newName}`);
            return true;
        }
        
        return false;
    }
};

module.exports = spawn1;