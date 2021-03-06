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
var distant_linker = require('role.distant_linker');
var center_transfer = require('role.center_transfer');
var miner = require('role.miner');
var distant_repairer = require('role.distant_repairer');
var harvest_linker = require('role.harvest_linker');
var waller = require('role.waller');
var warrior = require('role.warrior');
var maintainer = require('role.maintainer');
var manager = require('role.manager');
var scout = require('role.scout');
var boosted_upgrader = require('role.boosted_upgrader');
var assaulter = require('role.assaulter');
var superWarrior = require('role.superWarrior');
var deposit_harvester = require('role.deposit_harvester');
var ruin_transfer = require('role.ruin_transfer');
var power_attacker = require('role.power_attacker');
var power_healer = require('role.power_healer');
var power_retriever = require('role.power_retriever');
var wall_breaker = require('role.wall_breaker');
var slaimer = require('role.slaimer');
var thief = require('role.thief')

var power_creep = require('power_creep');

var basic_squad = require('basic_squad');

var {linkWork} = require('link');

const {
    reserveController,
    buildController,
    boostUpgradingController,
    labReactionController,
    defendController,
    terminalController,
    interRoomTransmissionController,
    boostController,
    mineralController,
    warController,
    factoryController,
    powerSpawnController,
    dailyMaintainController,
    powerSquadController,
    observerController,
    resourceDetector,
    boostPowerController,
    controllerMaintainer,
    resourceMaintainer,
    resourceShareController,
    interRoomResourceMaintainer,
    goodsController,
    energyMaintainController
} = require('overlord');

var {
    towerController
} = require('towerController');

require('./mount')();

require('./helper_cpuUsed');
require('./helper_roomResource');

const {
    roomSpawn,
    getRole,
    printRoomInfo,
    removeAll,
    printRoomRoleInfo,
    addReserve,
    removeRole,
    printSpawnQueue,
    removeReserve,
    createOrder,
    removeSquad,
    addSquad,
    roomSend,
    enableLab,
    setReaction,
    setBoost,
    setWar,
    setBoostUpgrade,
    addPowerSquad,
    removePowerSquad,
    setFactory,
    addFactoryMission,
    setPowerSpawn,
    setDailyMaintain,
    removeByPassRoom,
    addByPassRoom,
    launchNuker,
    fillNuker,
    deleteOrder,
    addObserveRoom,
    deleteRole,
    removeObserveRoom,
    setPowerCreep,
    setBoostPower,
    resetLabMission,
    roomSell,
    addResourceEntry,
    removeResourceEntry,
    addSharedResourceEntry,
    removeSharedResourceEntry,
    addGoodsMission,
    removeRoleAll
} = require('utils');

var {
    powerCreepController
} = require('powerCreepController');

const profiler = require('screeps-profiler');
// profiler.enable();

const roleArray = {
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
    rebuilder: rebuilder,
    distant_linker: distant_linker,
    center_transfer: center_transfer,
    miner: miner,
    distant_repairer: distant_repairer,
    harvest_linker: harvest_linker,
    waller: waller,
    maintainer: maintainer,
    manager: manager,
    scout: scout,
    boosted_upgrader: boosted_upgrader,
    assaulter: assaulter,
    superWarrior: superWarrior,
    deposit_harvester: deposit_harvester,
    ruin_transfer: ruin_transfer,
    power_attacker: power_attacker,
    power_healer: power_healer,
    power_retriever: power_retriever,
    wall_breaker: wall_breaker,
    slaimer: slaimer,
    thief: thief,

    // war
    attacker: warrior,
    healer: warrior
};

module.exports.loop = function() {
    profiler.wrap(function() {
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

    if (!Memory.cleanOrderCountdown || Game.time - Memory.cleanOrderCountdown > 1000) {
        Memory.cleanOrderCountdown = Game.time;
        deleteOrder()
    }

    //['E37S58', 'E37S59', 'E38S59', 'E38S60', 'E39S60', 'E40S60', 'E41S60' ,'E42S60', 'E43S60', 'E44S60', 'E45S60', 'E45S59']

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

        // priority check
        let check = false;
        let super_high_priority = ['maintainer'];
        let high_priority = ['harvester', 'transfer', 'harvest_linker', 'center_transfer'];

        for (let i = 0; i < room.memory.spawn_queue.length; i++) {
            if (super_high_priority.includes(room.memory.spawn_queue[i].role)) {
                check = true;
                let task = room.memory.spawn_queue[i];
                console.log(`spawning super high priority role ${task.role}`);
                let res = spawn1.spawn(spawn_name, task.role, task.roomname, task.isNeeded, task.respawnTime, task.extraInfo);
                if (res) {
                    room.memory.spawn_queue.splice(i, 1);
                    room.memory.energyTransferMission = true;
                }
                break;
            }
        }

        if (check) {
            continue;
        }

        for (let i = 0; i < room.memory.spawn_queue.length; i++) {
            if (high_priority.includes(room.memory.spawn_queue[i].role)) {
                check = true;
                let task = room.memory.spawn_queue[i];
                console.log(`spawning high priority role ${task.role}`);
                let res = spawn1.spawn(spawn_name, task.role, task.roomname, task.isNeeded, task.respawnTime, task.extraInfo);
                if (res) {
                    room.memory.spawn_queue.splice(i, 1);
                    room.memory.energyTransferMission = true;
                }
                break;
            }
        }

        if (check) {
            continue;
        }

        let task = room.memory.spawn_queue[0];
        let res = spawn1.spawn(spawn_name, task.role, task.roomname, task.isNeeded, task.respawnTime, task.extraInfo);
        if (res) {
            room.memory.spawn_queue.shift();
            room.memory.energyTransferMission = true;
        }
    }

    for (let room_name in Game.rooms) {
        let room = Game.rooms[room_name];
        if (room.controller && room.controller.my) {
            reserveController(room);
            buildController(room);
            linkWork(room);
            boostUpgradingController(room);
            labReactionController(room);
            defendController(room);
            terminalController(room);
            interRoomTransmissionController(room);
            boostController(room);
            mineralController(room);
            warController(room);
            factoryController(room);
            powerSpawnController(room);
            dailyMaintainController(room);
            observerController(room);
            powerSquadController(room);
            resourceDetector(room);
            towerController(room);
            powerCreepController(room);
            boostPowerController(room);
            controllerMaintainer(room);
            resourceMaintainer(room);
            resourceShareController(room);
            interRoomResourceMaintainer(room);
            goodsController(room);
            energyMaintainController(room);
        }
    }
    
    if (Memory.squads == undefined) {
        Memory.squads = new Array();
    }
    for (let i = 0; i < Memory.squads.length; i++) {
        basic_squad.run(Memory.squads[i]);
    }

    // var towers = _.filter(Game.structures, (s) => (s.structureType == STRUCTURE_TOWER));
    // for (let tower of towers) {
    //     Tower.run(tower);
    // }

    // if (Game.cpu.bucket == 10000) {
    //     console.log('generating pixel');
    //     Game.cpu.generatePixel();
    // }



    for (let name in Game.powerCreeps) {
        let creep = Game.powerCreeps[name];
        power_creep.run(creep);
    }

    // console.log('.............................');
    for (let name in Game.creeps) {
        let startCpu = Game.cpu.getUsed();

    // creep logic goes here

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

        if (!creep.memory.pause) {
            roleArray[creep.memory.role].run(creep);
        }

        let elapsed = Game.cpu.getUsed() - startCpu;
        // console.log('Creep '+ name+' has used '+ elapsed+' CPU time');
    }

    // HelperCpuUsed.exec();

    // console.log(`total used ${Game.cpu.getUsed()}`);
});
}

global.G_roomSpawn = roomSpawn;
global.G_printRoomInfo = printRoomInfo;
global.G_removeAll = removeAll;
global.G_printRoomRoleInfo = printRoomRoleInfo;
global.G_addReserve = addReserve;
global.G_removeRole = removeRole;
global.G_printSpawnQueue = printSpawnQueue;
global.G_removeReserve = removeReserve;
global.G_createOrder = createOrder;
global.G_removeSquad = removeSquad;
global.G_addSquad = addSquad;
global.G_roomSend = roomSend;
global.G_enableLab = enableLab;
global.G_setReaction = setReaction;
global.G_setBoost = setBoost;
global.G_setWar = setWar;
global.G_setBoostUpgrade = setBoostUpgrade;
global.G_addPowerSquad = addPowerSquad;
global.G_removePowerSquad = removePowerSquad;
global.G_addFactoryMission = addFactoryMission;
global.G_setFactory = setFactory;
global.G_setPowerSpawn = setPowerSpawn;
global.G_setDailyMaintain = setDailyMaintain;
global.G_addBypassRoom = addByPassRoom;
global.G_removeBypassRoom = removeByPassRoom;
global.G_launchNuker = launchNuker;
global.G_fillNuker = fillNuker;
global.G_deleteOrder = deleteOrder;
global.G_addObserveRoom = addObserveRoom;
global.G_deleteRole = deleteRole;
global.G_removeObserveRoom = removeObserveRoom;
global.G_setPowerCreep = setPowerCreep;
global.G_setBoostPower = setBoostPower;
global.G_resetLabMission = resetLabMission;
global.G_roomSell = roomSell;
global.G_addResourceEntry = addResourceEntry;
global.G_removeResourceEntry = removeResourceEntry;
global.G_addSharedResourceEntry = addSharedResourceEntry;
global.G_removeSharedResourceEntry = removeSharedResourceEntry;
global.G_addGoodsMission = addGoodsMission;
global.G_removeRoleAll = removeRoleAll;