var spawn1 = require('spawn1');
var worker = require('role.worker');
var harvester = require('role.harvester');
var transfer = require('role.transfer');
var builder = require('role.builder');
var distant_worker = require('role.distant_worker');
var repairer = require('role.repairer');
var upgrader = require('role.upgrader');
var Tower = require('tower');
var distant_harvester = require('role.distant_harvester');
var distant_transfer = require('role.distant_transfer');
var extender = require('role.extender');
var claimer = require('role.claimer');
var defender = require('role.defender');

var {spawn} = require('utils');

module.exports.loop = function() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            let memory = Memory.creeps[name];
            if (memory.isNeeded) {
                Memory.spawn_queue.push({role: memory.role, roomname: memory.roomname, spawn: memory.spawn, isNeeded: memory.isNeeded, extraInfo: memory.extraInfo})
            }
            delete Memory.creeps[name];
            console.log('delete creep: ', name);
        }
    }

    // Memory.spawn_queue.push({role: 'worker', roomname: 'W29S52', spawn: 'Spawn1', isNeeded: true, extraInfo: {working_location: '5bbcab5d9099fc012e6335cc'}})
    // Memory.spawn_queue.push({role: 'worker', roomname: 'W29S52', spawn: 'Spawn1', isNeeded: true, extraInfo: {working_location: '5bbcab5d9099fc012e6335cb'}})
    // spawn('distant_harvester', 'W29S52', 'Spawn1', true, {working_location: '5bbcab699099fc012e633749', working_room: 'W28S52'})

    if (Memory.spawn_queue.length != 0) {
        let task = Memory.spawn_queue[0];
        let res = false;
        if (task.spawn == 'Spawn1' && Game.spawns['Spawn1'] && !Game.spawns['Spawn1'].spawning) {
            if (spawn1.spawn(task.role, task.roomname, task.isNeeded, task.extraInfo) == true) {
                res = true;
            }
        }
        if (res) {
            Memory.spawn_queue.shift();
        }
    }

    var towers = _.filter(Game.structures, (s) => (s.structureType == STRUCTURE_TOWER));
    for (let tower of towers) {
        Tower.run(tower);
    }

    if (Game.cpu.bucket == 10000) {
        console.log('generating pixel');
        Game.cpu.generatePixel();
    }


    let roleArray = {
        worker: worker,
        harvester: harvester,
        transfer: transfer,
        builder: builder,
        repairer: repairer,
        distant_worker: distant_worker,
        upgrader: upgrader,
        distant_harvester: distant_harvester,
        distant_transfer: distant_transfer,
        extender: extender,
        claimer: claimer,
        defender: defender
    };

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        if (creep.memory.isNeeded && (creep.ticksToLive < 80 || (creep.memory.role == 'claimer' && creep.ticksToLive < 150))) {
            creep.say("I'm dying");
            let memory = creep.memory;
            Memory.spawn_queue.push({role: memory.role, roomname: memory.roomname, spawn: memory.spawn, isNeeded: memory.isNeeded, extraInfo: memory.extraInfo})
            creep.memory.isNeeded = false;
        }

        roleArray[creep.memory.role].run(creep);
    }
}