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
var outputer = require('role.outputer');
var controller = require('role.controller');
var rebuilder = require('role.rebuilder');

var {reserveController, buildController} = require('overlord');

require('./mount')();

var {
    roomSpawn,
    getRole,
    printRoomInfo,
    removeAll,
    printRoomRoleInfo,
    addReserve
} = require('utils');

module.exports.loop = function() {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            let memory = Memory.creeps[name];
            let room = Game.rooms[memory.roomname];
            if (memory.isNeeded) {
                room.memory.spawn_queue.push({
                    role: memory.role, 
                    roomname: memory.roomname, 
                    isNeeded: memory.isNeeded, 
                    respawnTime: memory.respawnTime, 
                    extraInfo: memory.extraInfo});
            }
            delete Memory.creeps[name];
            console.log('delete creep: ', name);
        }
    }

    for (let spawn_name in Game.spawns) {
        let spawn = Game.spawns[spawn_name];
        if (spawn.spawning) {
            continue;
        }

        let room = spawn.room;

        if (room.memory.spawn_queue == undefined) {
            room.memory.spawn_queue = new Array();
        }

        if (room.memory.spawn_queue.length == 0) {
            continue;
        }

        let task = room.memory.spawn_queue[0];
        let res = spawn1.spawn(spawn_name, task.role, task.roomname, task.isNeeded, task.respawnTime, task.extraInfo);
        if (res) {
            room.memory.spawn_queue.shift();
        }
    }

    for (let room_name in Game.rooms) {
        let room = Game.rooms[room_name];
        if (room.controller.my) {
            reserveController(room);
        }
        if (room.controller.my) {
            buildController(room);
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
        defender: defender,
        outputer: outputer,
        controller: controller,
        rebuilder: rebuilder
    };

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        if (creep.memory.isNeeded && creep.ticksToLive < creep.memory.respawnTime) {
            creep.say("I'm dying");
            let memory = creep.memory;
            let room = Game.rooms[memory.roomname];
            room.memory.spawn_queue.push({
                role: memory.role, 
                roomname: memory.roomname, 
                isNeeded: memory.isNeeded, 
                respawnTime: memory.respawnTime, 
                extraInfo: memory.extraInfo});
            creep.memory.isNeeded = false;
        }

        roleArray[creep.memory.role].run(creep);
    }
}

global.G_roomSpawn = roomSpawn;
global.G_printRoomInfo = printRoomInfo;
global.G_removeAll = removeAll;
global.G_printRoomRoleInfo = printRoomRoleInfo;
global.G_addReserve = addReserve;