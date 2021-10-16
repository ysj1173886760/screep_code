var spawn1 = {
    run: function() {
        
    },

    spawn: function(role, roomname, isNeeded, respawnTime, extraInfo) {
        let newName = role + Game.time;
        let result;
        let component = {
            worker: [WORK, WORK, MOVE, CARRY, CARRY, MOVE],
            harvester: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
            transfer: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY],
            builder: [WORK, WORK, MOVE, CARRY, MOVE, CARRY],
            distant_worker: [WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
            repairer: [WORK, WORK, MOVE, CARRY, CARRY, MOVE],
            upgrader: [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY],
            distant_harvester: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
            distant_transfer: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
            claimer: [CLAIM, MOVE],
            defender: [TOUGH, MOVE, TOUGH, MOVE, TOUGH, MOVE, ATTACK, MOVE],
            extender: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, WORK, CARRY, MOVE],
            outputer: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY],
        };
        result = Game.spawns['Spawn1'].spawnCreep(component[role], 
            newName, {memory: {role: role, roomname: roomname, isNeeded: isNeeded, respawnTime: respawnTime, extraInfo: extraInfo}});

        if (result == OK) {
            console.log(`spawn1 spawning ${newName}`);
            return true;
        }
        
        return false;
    }
};

module.exports = spawn1;