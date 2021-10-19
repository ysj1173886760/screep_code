var spawn1 = {
    run: function() {
        
    },

    /**
     * 
     * @param {string} spawn_name 
     * @param {string} role 
     * @param {string} roomname 
     * @param {boolean} isNeeded 
     * @param {number} respawnTime 
     * @param {*} extraInfo 
     * @returns 
     */
    spawn: function(spawn_name, role, roomname, isNeeded, respawnTime, extraInfo) {
        let newName = role + Game.time;
        let result;
        let component = {
            Spawn1: {
                rebuilder: [WORK, WORK, WORK , CARRY, CARRY, MOVE, MOVE],
                worker: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                harvester: [WORK, WORK, WORK, WORK, WORK, MOVE],
                transfer: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
                repairer: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                upgrader: [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
                builder: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                outputer: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
                distant_worker: [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
                distant_harvester: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
                distant_transfer: [WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                claimer: [CLAIM, CLAIM, MOVE, MOVE],
                defender: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, MOVE, MOVE, ATTACK, ATTACK],
            },
            Spawn3: {
                worker: [WORK, WORK, MOVE, CARRY, CARRY, MOVE],
                harvester: [WORK, WORK, WORK, WORK, WORK, MOVE],
                transfer: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY],
                builder: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                distant_worker: [WORK, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
                repairer: [WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY],
                upgrader: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
                distant_harvester: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
                distant_transfer: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE],
                controller: [CLAIM, MOVE],
                claimer: [CLAIM, CLAIM, MOVE, MOVE],
                defender: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, ATTACK, MOVE, MOVE, MOVE, MOVE],
                extender: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE],
                outputer: [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
            },
            Spawn2: {
                builder: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                worker: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                repairer: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                transfer: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                harvester: [WORK, WORK, WORK, WORK, WORK, MOVE],
                upgrader: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE]
            }
        };

        // @ts-ignore
        let tmp = component[spawn_name];
        result = Game.spawns[spawn_name].spawnCreep(tmp[role], 
            newName, {memory: {role: role, roomname: roomname, isNeeded: isNeeded, respawnTime: respawnTime, extraInfo: extraInfo}});

        if (result == OK) {
            console.log(`${spawn_name} spawning ${newName}`);
            return true;
        }
        
        return false;
    },
};

module.exports = spawn1;