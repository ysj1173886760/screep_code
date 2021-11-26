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
        let newName = role + Game.time + spawn_name;
        let result;
        const component = {
            E37S58: {
                rebuilder: {work: 3, carry: 2, move: 2},
                worker: {work: 3, carry: 2, move: 2},
                harvester: {work: 6, move: 1},
                transfer: {carry: 10, move: 5},
                repairer: {work: 5, carry: 5, move: 5},
                upgrader: {work: 1, carry: 1, move: 1},
                builder: {work: 10, carry: 10, move: 10},
                outputer: {carry: 4, move: 2},
                distant_worker: {work: 4, carry: 4, move: 4},
                distant_harvester: {work: 8, carry: 2, move: 4},
                distant_transfer: {carry: 28, move: 14},
                claimer: {claim: 5, move: 5},
                defender: {tough: 13, attack: 5, move: 9},
                center_transfer: {carry: 16, move: 1},
                distant_linker: {carry: 32, move: 16},
                extender: {work: 15, carry: 20, move: 15}, 
                controller: {claim: 1, move: 5},
                miner: {work: 10, carry: 10, move: 10},
                harvest_linker: {work: 7, carry: 1, move: 1},
                maintainer: {carry: 32, move: 16},
                manager: {carry: 20, move: 10},
                waller: {work: 10, carry: 10, move: 20},
                boosted_upgrader: {work: 30, carry: 6, move: 5},
                superWarrior: {tough: 6, ranged_attack: 22, move: 10, heal: 12},
                healer: {tough: 12, move: 10, heal: 28},
                attacker: {tough: 12, move: 10, attack: 28},
                deposit_harvester: {work: 15, carry: 10, move: 25},
                power_attacker: {move: 20, attack: 20},
                power_healer: {heal: 25, move: 25},
                power_retriever: {carry: 32, move: 16},
                distant_repairer: {work: 5, carry: 5, move: 5},
                assaulter: {move: 10, attack: 10},
                wall_breaker: {work: 40, move: 10},
                slaimer: {ranged_attack: 20, move: 25, heal: 5},
            },
            E45S59: {
                builder: {work: 10, carry: 10, move: 10},
                worker: {work: 1, carry: 2, move: 2},
                repairer: {work: 5, carry: 5, move: 5},
                transfer: {carry: 16, move: 8},
                harvester: {work: 5, move: 1},
                upgrader: {work: 1, carry: 1, move: 1},
                outputer: {carry: 26, move: 13},
                distant_worker: {work: 4, carry: 4, move: 4},
                distant_harvester: {work: 8, carry: 2, move: 4},
                distant_transfer: {carry: 32, move: 16},
                distant_repairer: {work: 5, carry: 5, move: 5},
                defender: {tough: 13, attack: 5, move: 18},
                distant_linker: {carry: 32, move: 16},
                waller: {work: 10, carry: 10, move: 20},
                maintainer: {carry: 32, move: 16},
                claimer: {claim: 5, move: 5},
                scout: {move: 1},
                controller: {claim: 1, move: 1},
                extender: {work: 15, carry: 20, move: 15}, 
                harvest_linker: {work: 15, carry: 3, move: 8},
                center_transfer: {carry: 30, move: 1},
                manager: {carry: 20, move: 10},
                miner: {work: 10, carry: 10, move: 10},
                assaulter: {move: 10, attack: 10},
                rebuilder: {carry: 2, move: 1},
                boosted_upgrader: {work: 30, carry: 6, move: 5},
                deposit_harvester: {work: 15, carry: 10, move: 25},
                power_attacker: {move: 20, attack: 20},
                power_healer: {heal: 25, move: 25},
                power_retriever: {carry: 32, move: 16},
                healer: {tough: 12, move: 10, heal: 28},
                attacker: {tough: 12, move: 10, attack: 28},
            },
            E47S59: {
                worker: {work: 1, carry: 1, move: 1},
                harvester: {work: 5, move: 1},
                builder: {work: 4, carry: 4, move: 4},
                repairer: {work: 2, carry: 2, move: 2},
                transfer: {carry: 10, move: 5},
                center_transfer: {carry: 8, move: 1},
                harvest_linker: {work: 7, carry: 1, move: 1},
                maintainer: {carry: 20, move: 10},
                upgrader: {work: 1, carry: 1, move: 1},
                manager: {carry: 10, move: 5},
                outputer: {carry: 24, move: 12},
                rebuilder: {carry: 2, move: 1},
                assaulter: {move: 10, attack: 10},
                miner: {work: 10, carry: 10, move: 10},
                ruin_transfer: {carry: 16, move: 8},
                boosted_upgrader: {work: 20, carry: 5, move: 10},
                defender: {tough: 13, attack: 5, move: 9},
                claimer: {claim: 5, move: 5},
                distant_harvester: {work: 8, carry: 2, move: 4},
                distant_transfer: {carry: 16, move: 8},
                distant_repairer: {work: 5, carry: 5, move: 5},
                power_attacker: {move: 20, attack: 20},
                power_healer: {heal: 25, move: 25},
                power_retriever: {carry: 32, move: 16},
                deposit_harvester: {work: 15, carry: 10, move: 25},

            },
            E31S58: {
                worker: {work: 1, carry: 1, move: 1},
                harvester: {work: 5, move: 1},
                transfer: {carry: 8, move: 4},
                upgrader: {work: 1, move: 1, carry: 1},
                repairer: {work: 3, carry: 3, move: 3},
                builder: {work: 5, carry: 5, move: 5},
                outputer: {carry: 16, move: 8},
                harvest_linker: {work: 7, carry: 1, move: 1},
                center_transfer: {carry: 16, move: 1},
                miner: {work: 10, carry: 10, move: 10},
                maintainer: {carry: 16, move: 8},
                boosted_upgrader: {work: 10, carry: 2, move: 5},
                manager: {carry: 10, move: 5},
                deposit_harvester: {work: 15, carry: 10, move: 25},
                wall_breaker: {work: 25, move: 25},
                controller: {claim: 1, move: 1},
                extender: {work: 15, carry: 20, move: 15}, 
                power_attacker: {move: 20, attack: 20},
                power_healer: {heal: 25, move: 25},
                power_retriever: {carry: 32, move: 16},
            },
            E35S52: {
                harvester: {work: 5, move: 1},
                worker: {work: 1, carry: 1, move: 1},
                transfer: {carry: 8, move: 4},
                upgrader: {work: 10, move: 2, carry: 2},
                repairer: {work: 2, carry: 2, move: 2},
                builder: {work: 5, carry: 5, move: 5},
                outputer: {carry: 20, move: 10},
                harvest_linker: {work: 7, carry: 1, move: 1},
                center_transfer: {carry: 8, move: 1},
                miner: {work: 5, carry: 5, move: 5},
                maintainer: {carry: 16, move: 8},
                boosted_upgrader: {work: 20, carry: 6, move: 10},
                manager: {carry: 10, move: 5},
            },
            E44S59: {
                harvester: {work: 5, move: 1},
                worker: {work: 1, carry: 1, move: 1},
                transfer: {carry: 8, move: 4},
                upgrader: {work: 10, move: 2, carry: 2},
                repairer: {work: 2, carry: 2, move: 2},
                builder: {work: 5, carry: 5, move: 5},
                outputer: {carry: 10, move: 5},
                harvest_linker: {work: 7, carry: 1, move: 1},
                center_transfer: {carry: 8, move: 1},
                miner: {work: 5, carry: 5, move: 5},
                maintainer: {carry: 16, move: 8},
                boosted_upgrader: {work: 10, carry: 2, move: 5},
                manager: {carry: 10, move: 5},
            },
            E26S59: {
                worker: {work: 4, carry: 1, move: 2},
                builder: {work: 2, carry: 1, move: 1},
                controller: {claim: 1, move: 1},
                extender: {work: 3, move: 3, carry: 3}
            },
            test: {
                attacker: {move: 2},
                healer: {move: 2}
            },

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