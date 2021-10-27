var {
    getBodyParts
} = require('utils');

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
        // type MOVE = "move";
        // type WORK = "work";
        // type CARRY = "carry";
        // type ATTACK = "attack";
        // type RANGED_ATTACK = "ranged_attack";
        // type TOUGH = "tough";
        // type HEAL = "heal";
        // type CLAIM = "claim";
        let newName = role + Game.time;
        let result;
        let component = {
            E37S58: {
                rebuilder: {work: 3, carry: 2, move: 2},
                worker: {work: 3, carry: 2, move: 2},
                harvester: {work: 6, move: 1},
                transfer: {carry: 10, move: 5},
                repairer: {work: 5, carry: 5, move: 5},
                upgrader: {work: 20, carry: 4, move: 5},
                builder: {work: 5, carry: 5, move: 5},
                outputer: {carry: 16, move: 8},
                distant_worker: {work: 4, carry: 4, move: 4},
                distant_harvester: {work: 8, carry: 2, move: 4},
                distant_transfer: {work: 1, carry: 27, move: 14},
                claimer: {claim: 2, move: 2},
                defender: {tough: 9, move: 6, attack: 3},
                center_transfer: {carry: 8, move: 1},
                distant_linker: {carry: 16, move: 8},
                extender: {work: 5, carry: 5, move: 5}, 
                controller: {claim: 1, move: 1},
                miner: {work: 5, carry: 5, move: 5},
                harvest_linker: {work: 7, carry: 1, move: 1},
                maintainer: {carry: 30, move: 15},
                manager: {carry: 10, move: 5},
            },
            E45S59: {
                builder: {work: 5, carry: 5, move: 5},
                worker: {work: 1, carry: 2, move: 2},
                repairer: {work: 4, carry: 4, move: 4},
                transfer: {carry: 16, move: 8},
                harvester: {work: 5, move: 1},
                upgrader: {work: 10, carry: 2, move: 5},
                outputer: {carry: 20, move: 10},
                distant_worker: {work: 4, carry: 4, move: 4},
                distant_harvester: {work: 6, carry: 2, move: 3},
                distant_transfer: {carry: 16, move: 8},
                distant_repairer: {work: 4, carry: 4, move: 4},
                defender: {tough: 9, attack: 3, move: 6},
                waller: {work: 2, carry: 6, move: 4},
                maintainer: {carry: 24, move: 12},
                claimer: {claim: 2, move: 2},
                scout: {move: 1},
                controller: {claim: 1, move: 1},
                extender: {work: 5, carry: 5, move: 5}, 
                harvest_linker: {work: 7, carry: 1, move: 1},
                center_transfer: {carry: 8, move: 1},
                manager: {carry: 10, move: 5},
                miner: {work: 5, carry: 5, move: 5},
            },
            E47S59: {
                rebuilder: {work: 1, carry: 1, move: 1}, 
                worker: {work: 1, carry: 1, move: 1},
                harvester: {work: 5, move: 1},
                builder: {work: 3, carry: 3, move: 3},
                repairer: {work: 2, carry: 2, move: 2},
                transfer: {carry: 8, move: 4},
                upgrader: {work: 5, carry: 1, move: 2},
            },
            test: {
                attacker: {move: 2},
                healer: {move: 2}
            }
        };

        // @ts-ignore
        let tmp = component[roomname];
        result = Game.spawns[spawn_name].spawnCreep(getBodyParts(tmp[role]), 
            newName, {memory: {role: role, roomname: roomname, isNeeded: isNeeded, respawnTime: respawnTime, extraInfo: extraInfo}});

        if (result == OK) {
            console.log(`${spawn_name} spawning ${newName}`);
            return true;
        } else {
            console.log(`${roomname} ${result} failed to spawn ${role}`);
        }
        
        return false;
    },
};

module.exports = spawn1;