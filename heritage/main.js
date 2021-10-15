var roleHarvester = require('role.harvester');
var spawn1 = require('spawn1');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var Tower = require('tower');
var roleTransfer = require('role.transfer');
var roleOutputer = require('role.outputer');
var roleAttacker = require('role.attacker');
var roleClaimer = require('role.claimer');
var roleWorker = require('role.worker');
var spawn2 = require('spawn2');
var spawn3 = require('spawn3');
var roleMiner = require('role.miner');
var linkWork = require('room.link');
var roleManager = require('role.manager');
var roleMainTransfer = require('role.mainTransfer');
var roleDistantHarvester = require('role.distant_harvester');
var roleDistantTransfer = require('role.distant_transfer');

module.exports.loop = function()
{
    /*
        create flag
    */
    //let pos = new RoomPosition(35, 31, 'E12N26');
    //pos.createFlag('reserve E12N26');
    for(let name in Memory.creeps)
    {
        if(!Game.creeps[name])
        {
            delete Memory.creeps[name];
            console.log('clearing non-existing creep:', name);
        }
    }

    if(Game.cpu.bucket > 9000)
    {
        console.log('generating pixel');
        Game.cpu.generatePixel();
    }

    /*
        run structures
    */
    var towers = _.filter(Game.structures, (s) => (s.structureType == STRUCTURE_TOWER));
    for(let tower of towers)
    {
        Tower.run(tower);
    }
    if(Game.spawns['Spawn1'] && !Game.spawns['Spawn1'].spawning)
        spawn1.run();
    if(Game.spawns['Spawn2'] && !Game.spawns['Spawn2'].spawning)
        spawn2.run();
    if(Game.spawns['Spawn3'] && !Game.spawns['Spawn3'].spawning)
        spawn3.run();
    linkWork(Game.rooms['E13N25']);
    linkWork(Game.rooms['E13N26']);
    linkWork(Game.rooms['E12N25']);

    /*
        run creeps
    */
    for(let name in Game.creeps)
    {
        let creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester')
        {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader')
        {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder')
        {
            roleBuilder.run(creep);
        }
        else if(creep.memory.role == 'repairer')
        {
            roleRepairer.run(creep);
        }
        else if(creep.memory.role == 'outputer')
        {
            roleOutputer.run(creep);
        }
        else if(creep.memory.role == 'transfer')
        {
            roleTransfer.run(creep);
        }
        else if(creep.memory.role == 'attacker' || creep.memory.role == 'attacker1')
        {
            roleAttacker.run(creep);
        }
        else if(creep.memory.role == 'claimer' || creep.memory.role == 'claimer1')
        {
            roleClaimer.run(creep);
        }
        else if(creep.memory.role == 'worker')
        {
            roleWorker.run(creep);
        }
        else if(creep.memory.role == 'miner')
        {
            roleMiner.run(creep);
        }
        else if(creep.memory.role == 'manager')
        {
            roleManager.run(creep);
        }
        else if(creep.memory.role == 'mainTransfer')
        {
            roleMainTransfer.run(creep);
        }
        else if(creep.memory.role == 'distant_harvester' || creep.memory.role == 'distant_harvester1')
        {
            roleDistantHarvester.run(creep);
        }
        else if(creep.memory.role == 'distant_transfer' || creep.memory.role == 'distant_transfer1')
        {
            roleDistantTransfer.run(creep);
        }
    }
}