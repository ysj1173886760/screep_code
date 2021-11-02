const { getStructureByFlag, containBodyPart } = require("utils");
const { whiteList } = require("whiteList");
const { roomSpawn } = require("./utils");

function setDistantCreeps(roomname, target_room, value) {
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (creep.memory.role == 'distant_transfer' || 
            creep.memory.role == 'distant_harvester' ||
            creep.memory.role == 'distant_linker' ||
            creep.memory.role == 'distant_repairer' ||
            creep.memory.role == 'distant_worker') {
            if (creep.memory.roomname != roomname) {
                continue;
            }

            if (creep.memory.extraInfo && creep.memory.extraInfo.working_room == target_room) {
                creep.memory.pause = value;
            }
        }
    }
}

function reserveController(room) {
    if (room.memory.reserve_rooms == undefined) {
        room.memory.reserve_rooms = {};
    }

    for (let room_name in room.memory.reserve_rooms) {
        let reserve_room = Game.rooms[room_name];
        if (reserve_room && room.memory.reserve_rooms[room_name] <= 0) {
            room.memory.reserve_rooms[room_name] = 100;
            if (reserve_room.find(FIND_HOSTILE_CREEPS).length > 0) {
                setDistantCreeps(room.name, reserve_room.name, true);
                console.log('detecting invaders, pausing creeps');
                continue;
            } else {
                console.log('restart creeps');
                setDistantCreeps(room.name, room_name, false);
            }

            if (reserve_room.controller.reservation == undefined || 
                reserve_room.controller.reservation.username != 'heavensheep' || 
                reserve_room.controller.reservation.ticksToEnd < 500) {
                console.log(`detected ${reserve_room} need reserver, sending mission`);
                room.memory.spawn_queue.push({
                    role: 'claimer', 
                    roomname: room.name, 
                    isNeeded: false, 
                    respawnTime: 100, 
                    extraInfo: {working_room: room_name}
                });
                room.memory.reserve_rooms[room_name] += 500;
            }
        }
        room.memory.reserve_rooms[room_name]--;
    }
}

function buildController(room) {
    if (room.memory.buildInfo == undefined) {
        room.memory.buildInfo = {
            building: false,
            counter: 0
        }
    }

    if (room.controller.level < 3) {
        return;
    }

    if (room.memory.buildInfo.counter <= 0) {
        room.memory.buildInfo.counter = 200;
        let target = room.find(FIND_CONSTRUCTION_SITES, {
            filter: (c) => {
                return c.structureType != STRUCTURE_WALL &&
                        c.structureType != STRUCTURE_RAMPART;
            }
        });
        if (target.length > 0) {
            if (!room.memory.buildInfo.building) {
                console.log('detected construction sites, sending building mission');
                if (room.storage) {
                    let task = {
                        role: 'builder',
                        roomname: room.name,
                        isNeeded: true,
                        respawnTime: 80,
                        extraInfo: {workling_location: 2}
                    }
                    // two builder
                    room.memory.spawn_queue.push(task);
                    room.memory.spawn_queue.push(task);
                } else if (Game.flags[`upgrade_container ${room.name}`] != undefined) {
                    // two for 2
                    let task = {
                        role: 'builder',
                        roomname: room.name,
                        isNeeded: true,
                        respawnTime: 80,
                        extraInfo: {working_location: 2}
                    }
                    room.memory.spawn_queue.push(task);
                } else {
                    // one for 1, one for 0
                    room.memory.spawn_queue.push({
                        role: 'builder',
                        roomname: room.name,
                        isNeeded: true,
                        respawnTime: 80,
                        extraInfo: {working_location: 0}
                    });
                    room.memory.spawn_queue.push({
                        role: 'builder',
                        roomname: room.name,
                        isNeeded: true,
                        respawnTime: 80,
                        extraInfo: {working_location: 1}
                    });
                }
                room.memory.buildInfo.building = true;
            }
        } else {
            if (room.memory.buildInfo.building) {
                let creeps = _.filter(Game.creeps, (c) => (c.memory.role == 'builder' && c.memory.roomname == room.name));
                if (creeps.length > 0) {
                    for (let name in creeps) {
                        let creep = creeps[name];
                        creep.memory.isNeeded = false;
                    }
                }
                room.memory.buildInfo.building = false
                console.log("all building mission complete");
            }
        }
    }
    room.memory.buildInfo.counter--;
}

function boostUpgradingController(room) {
    if (room.memory.boostUpgrade == undefined) {
        room.memory.boostUpgrade = {
            enable: false,
            countdown: 0,
        }
    }

    if (room.memory.boostUpgrade.enable == false) {
        return;
    }

    if (room.memory.boostUpgrade.countdown != 0) {
        room.memory.boostUpgrade.countdown--;
        return;
    }
    room.memory.boostUpgrade.countdown = 100;

    // should order some energy
    if (room.storage.store[RESOURCE_ENERGY] <= 300000) {
        
        let myorders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY, roomName: room.name});
        if (myorders.length) {
            console.log(`${room.name} has already ordered the energy`);
            return;
        }

        let orders = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});
        top5 = orders.sort((a, b) => (b.price - a.price)).slice(0, 5);
        let sum = 0.0;
        for (let i = 0; i < top5.length; i++) {
            sum += top5[i].price;
        }
        sum /= top5.length;
        
        let amount = 100000;
        
        Game.market.createOrder({
            type: ORDER_BUY,
            resourceType: RESOURCE_ENERGY,
            price: sum,
            totalAmount: amount,
            roomName: room.name,
        });

        console.log(`creating order for ${room.name}, buying ${amount} energy for ${sum}`)
    }
}

const boostingCountdown = 2000;
const reloadCountdown = 100;
const labControllerCountdown = 5;
const boostControllerCountdown = 5;

function labReactionController(room) {
    if (room.memory.task_queue == undefined) {
        room.memory.task_queue = new Array();
    }

    if (room.memory.labController == undefined) {
        let flag1 = Game.flags[`lab 1 ${room.name}`];
        let flag2 = Game.flags[`lab 2 ${room.name}`];
        if (!flag1 || !flag2) {
            return;
        }
        let lab1 = getStructureByFlag(flag1, STRUCTURE_LAB);
        let lab2 = getStructureByFlag(flag2, STRUCTURE_LAB);
        let labs = room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_LAB && 
                        s.id != lab1.id &&
                        s.id != lab2.id;
            }
        })

        let sendMission = {};
        sendMission[lab1.id] = false;
        sendMission[lab2.id] = false;

        let outlab = new Array();

        let boosting = {};
        boosting[lab1.id] = {
            countdown: boostingCountdown,
            enabled: false,
        }
        boosting[lab2.id] = {
            countdown: boostingCountdown,
            enabled: false,
        }

        for (let i = 0; i < labs.length; i++) {
            outlab.push(labs[i].id);
            sendMission[labs[i].id] = false;
            boosting[labs[i].id] = {
                countdown: boostingCountdown,
                enabled: false,
            }
        }

        room.memory.labController = {
            lab1: lab1.id,
            lab2: lab2.id,
            labs: outlab,
            stage: 'check',
            countdown: 5,
            enabled: false,
            missionControl: sendMission,
            boostControl: boosting
        };
    }

    if (room.memory.labController.enabled == false) {
        return;
    }

    room.memory.labController.countdown--;
    if (room.memory.labController.countdown != 0) {
        return;
    }
    room.memory.labController.countdown = labControllerCountdown;

    if (room.memory.labController.current_mission == undefined) {
        return;
    }

    let res1 = room.memory.labController.current_mission.res1;
    let res2 = room.memory.labController.current_mission.res2;
    let amountNeeded = 2000;

    if (room.memory.labController.stage == 'check') {
        console.log('lab checking');
        let storage = room.storage;
        if (storage.store[res1] < 3000) {
            room.memory.labController.enabled = false;
            return;
        }

        if (storage.store[res2] < 3000) {
            room.memory.labController.enabled = false;
            return;
        }

        if (storage.store[RESOURCE_ENERGY] < 100000) {
            room.memory.labController.enabled = false;
            return;
        }

        let lab1 = Game.getObjectById(room.memory.labController.lab1);
        let lab2 = Game.getObjectById(room.memory.labController.lab2);

        for (let resourceType in lab1.store) {
            if (resourceType == RESOURCE_ENERGY || resourceType == res1) {
                continue;
            }
            // send back to storage
            if (lab1.store[resourceType] > 0) {
                let task = {
                    from: lab1.id,
                    to: storage.id,
                    type: resourceType,
                    amount: lab1.store[resourceType],
                }
                room.memory.task_queue.push(task);
            }
        }

        for (let resourceType in lab2.store) {
            if (resourceType == RESOURCE_ENERGY || resourceType == res2) {
                continue;
            }
            // send back to storage
            if (lab2.store[resourceType] > 0) {
                let task = {
                    from: lab2.id,
                    to: storage.id,
                    type: resourceType,
                    amount: lab2.store[resourceType],
                }
                room.memory.task_queue.push(task);
            }
        }
        
        if (lab1.store[res1] < amountNeeded) {
            let task = {
                from: storage.id,
                to: lab1.id,
                type: res1,
                amount: amountNeeded - lab1.store[res1],
            }
            room.memory.task_queue.push(task);
        }

        if (lab2.store[res2] < amountNeeded) {
            let task = {
                from: storage.id,
                to: lab2.id,
                type: res2,
                amount: amountNeeded - lab2.store[res2],
            }
            room.memory.task_queue.push(task);
        }

        if (lab1.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            task = {
                from: storage.id,
                to: lab1.id,
                type: RESOURCE_ENERGY,
                amount: lab1.store.getFreeCapacity(RESOURCE_ENERGY)
            }
            room.memory.task_queue.push(task);
        }

        if (lab2.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            task = {
                from: storage.id,
                to: lab2.id,
                type: RESOURCE_ENERGY,
                amount: lab2.store.getFreeCapacity(RESOURCE_ENERGY)
            }
            room.memory.task_queue.push(task);
        }

        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            // skip the boost lab
            if (room.memory.labController.boostControl[lab.id].enabled) {
                continue;
            }
            if (lab.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                task = {
                    from: storage.id,
                    to: lab.id,
                    type: RESOURCE_ENERGY,
                    amount: lab.store.getFreeCapacity(RESOURCE_ENERGY)
                }
                room.memory.task_queue.push(task);
            }

            for (let resourceType in lab.store) {
                if (resourceType == RESOURCE_ENERGY) {
                    continue;
                }
                // send back to storage
                if (lab.store[resourceType] > 0) {
                    let task = {
                        from: lab.id,
                        to: storage.id,
                        type: resourceType,
                        amount: lab.store[resourceType],
                    }
                    room.memory.task_queue.push(task);
                }
            }
        }

        room.memory.labController.stage = 'prepare';
    }

    if (room.memory.labController.stage == 'prepare') {
        let lab1 = Game.getObjectById(room.memory.labController.lab1);
        let lab2 = Game.getObjectById(room.memory.labController.lab2);

        if (lab1.store[res1] < amountNeeded) {
            return;
        }
        if (lab2.store[res2] < amountNeeded) {
            return;
        }
        if (lab1.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }
        if (lab2.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            return;
        }
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            // skip the boost lab
            if (room.memory.labController.boostControl[lab.id].enabled) {
                continue;
            }
            if (lab.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                return;
            }
            if (lab.store[lab.mineralType] > 0) {
                return;
            }
            room.memory.labController.missionControl[lab.id] = false;
        }

        console.log('lab prepare done');
        room.memory.labController.stage = 'work';
    }

    if (room.memory.labController.stage == 'work') {
        let res = false;
        let lab1 = Game.getObjectById(room.memory.labController.lab1);
        let lab2 = Game.getObjectById(room.memory.labController.lab2);
        let storage = room.storage;

        if (storage.store[res1] > 500 && storage.store[res2] > 500) {
            if (lab1.store[res1] < 500) {
                if (room.memory.labController.missionControl[lab1.id] == false) {
                    room.memory.task_queue.push({
                        from: storage.id,
                        to: lab1.id,
                        type: res1,
                        amount: 500
                    });
                    room.memory.labController.missionControl[lab1.id] = true;
                }
            } else {
                room.memory.labController.missionControl[lab1.id] = false;
            }

            if (lab2.store[res2] < 500) {
                if (room.memory.labController.missionControl[lab2.id] == false) {
                    room.memory.task_queue.push({
                        from: storage.id,
                        to: lab2.id,
                        type: res2,
                        amount: 500
                    });
                    room.memory.labController.missionControl[lab2.id] = true;
                }
            } else {
                room.memory.labController.missionControl[lab2.id] = false;
            }
        }
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            // skip the boost lab
            if (room.memory.labController.boostControl[lab.id].enabled) {
                continue;
            }
            if (lab.store[lab.mineralType] > 500) {
                if (room.memory.labController.missionControl[lab.id] == false) {
                    room.memory.task_queue.push({
                        from: lab.id,
                        to: storage.id,
                        type: lab.mineralType,
                        amount: 500
                    });
                    room.memory.labController.missionControl[lab.id] = true;
                }
            } else {
                room.memory.labController.missionControl[lab.id] = false;
            }

            let ret = lab.runReaction(lab1, lab2);

            if (ret == OK || ret == ERR_TIRED) {
                res = true;
            }
        }
        
        if (!res) {
            room.memory.labController.stage = 'retrieve';
        }
    }

    if (room.memory.labController.stage == 'retrieve') {
        console.log('lab retrieving');
        let lab1 = Game.getObjectById(room.memory.labController.lab1);
        let lab2 = Game.getObjectById(room.memory.labController.lab2);
        let storage = room.storage;

        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            // skip the boost lab
            if (room.memory.labController.boostControl[lab.id].enabled) {
                continue;
            }
            for (let resourceType in lab.store) {
                if (lab.store[resourceType] > 0 && resourceType != RESOURCE_ENERGY) {
                    room.memory.task_queue.push({
                        from: lab.id,
                        to: storage.id,
                        type: resourceType,
                        amount: lab.store[resourceType]
                    });
                }
            }
        }
        room.memory.labController.stage = 'finalize';
    }

    if (room.memory.labController.stage == 'finalize') {
        let lab1 = Game.getObjectById(room.memory.labController.lab1);
        let lab2 = Game.getObjectById(room.memory.labController.lab2);
        let storage = room.storage;
        
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            // skip the boost lab
            if (room.memory.labController.boostControl[lab.id].enabled) {
                continue;
            }
            for (let resourceType in lab.store) {
                if (lab.store[resourceType] > 0 && resourceType != RESOURCE_ENERGY) {
                    return;
                }
            }
        }

        room.memory.labController.stage = 'check';
        console.log('lab finalized');
    }

}

function boostController(room) {
    if (room.memory.labController == undefined) {
        return;
    }

    if (room.memory.boostController == undefined) {
        room.memory.boostController = {
            boostQueue: new Array(),
            currentBoostCreep: {
                id: '',
                boostResource: [],
            },
            stage: 'wait',
            enabled: false,
            countdown: boostControllerCountdown
        }
    }

    if (room.memory.boostController.enabled == false) {
        return;
    }

    room.memory.boostController.countdown--;
    if (room.memory.boostController.countdown > 0) {
        return;
    }

    room.memory.boostController.countdown = 5;

    if (room.memory.boostController.stage == 'wait') {
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let id = room.memory.labController.labs[i];
            if (room.memory.labController.boostControl[id].enabled) {
                if (Game.time - room.memory.labController.boostControl[id].countdown < reloadCountdown) {
                    continue;
                }

                console.log('reloading boost lab');
                let storage = room.storage;
                let lab = Game.getObjectById(id);
                if (lab.store[lab.mineralType] < 1500) {
                    room.memory.task_queue.push({
                        from: storage.id,
                        to: lab.id,
                        type: lab.mineralType,
                        amount: 1500 - lab.store[lab.mineralType]
                    });
                }

                if (lab.store[RESOURCE_ENERGY] < 1000) {
                    room.memory.task_queue.push({
                        from: storage.id,
                        to: lab.id,
                        type: RESOURCE_ENERGY,
                        amount: 1000 - lab.store[RESOURCE_ENERGY],
                    });
                }
                room.memory.labController.boostControl[lab.id].countdown = Game.time;
            }
        }
        if (room.memory.boostController.boostQueue.length == 0) {
            return;
        }
        room.memory.boostController.currentBoostCreep = room.memory.boostController.boostQueue[0];
        console.log(`accept boost mission`);
        room.memory.boostController.boostQueue.shift();
        room.memory.boostController.stage = 'check';
    }

    if (room.memory.boostController.stage == 'check') {
        room.memory.boostController.boostEntry = new Array();
        for (let j = 0; j < room.memory.boostController.currentBoostCreep.boostResource.length; j++) {
            let res = room.memory.boostController.currentBoostCreep.boostResource[j];
            
            // check whether the boosting lab have already had this resource
            let check = false;
            for (let i = 0; i < room.memory.labController.labs.length; i++) {
                let id = room.memory.labController.labs[i];
                if (room.memory.labController.boostControl[id].enabled) {
                    let lab = Game.getObjectById(id);
                    if (lab.store[lab.mineralType] > 0 && lab.mineralType == res) {
                        check = true;
                        room.memory.boostController.boostEntry.push({
                            type: res,
                            id: lab.id,
                        });
                        break;
                    }
                }
            }
            
            if (check) {
                continue;
            }

            // otherwise, we need to find a victim
            for (let i = 0; i < room.memory.labController.labs.length; i++) {
                let id = room.memory.labController.labs[i];
                if (!room.memory.labController.boostControl[id].enabled) {
                    room.memory.labController.boostControl[id].enabled = true;
                    room.memory.labController.missionControl[id] = false;
                    room.memory.boostController.boostEntry.push({
                        type: res,
                        id: id
                    });
                    console.log(`find victim ${id}`);
                    check = true;
                    break;
                }
            }

            if (!check) {
                console.log('failed to boost due to not enough labs');
                room.memory.boostController.stage = 'failed';
                break;
            }
            
        }

        if (room.memory.boostController.stage != 'failed') {
            // sanity check
            let length = room.memory.boostController.currentBoostCreep.boostResource.length;
            if (room.memory.boostController.boostEntry.length != length) {
                console.log(`boost check stage failed due to unknown error, expect ${length}, read ${room.memory.boostController.boostEntry.length}`);
                room.memory.boostController.stage = 'failed';
            } else {
                room.memory.boostController.stage = 'check_resource';
            }
        }
    }

    if (room.memory.boostController.stage == 'check_resource') {
        let storage = room.storage;
        if (storage.store[RESOURCE_ENERGY] < 10000) {
            console.log('boost check_resource stage failed due to lacked energy');
        }

        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);
            if (!lab) {
                room.memory.boostController.stage = 'failed';
                console.log('boost check_resource stage failed due to null lab');
                return;
            }

            if (storage.store[entry.type] < 3000) {
                room.memory.boostController.stage = 'failed';
                console.log('boost check_resource stage failed due to lacked resources');
                return;
            }
        }

        room.memory.boostController.stage = 'prepare';
    }

    if (room.memory.boostController.stage == 'prepare') {
        let storage = room.storage;
        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);
            // clear lab first
            if (lab.mineralType != entry.type && lab.store[lab.mineralType] > 0) {
                room.memory.task_queue.push({
                    from: lab.id,
                    to: storage.id,
                    type: lab.mineralType,
                    amount: lab.store[lab.mineralType]
                });
            }

            if (lab.store[entry.type] < 1500) {
                room.memory.task_queue.push({
                    from: storage.id,
                    to: lab.id,
                    type: entry.type,
                    amount: 1500 - lab.store[entry.type]
                });
                room.memory.labController.boostControl[lab.id].countdown = Game.time;
            }

            if (lab.store[RESOURCE_ENERGY] < 1000) {
                room.memory.task_queue.push({
                    from: storage.id,
                    to: lab.id,
                    type: RESOURCE_ENERGY,
                    amount: 1000 - lab.store[RESOURCE_ENERGY],
                });
                room.memory.labController.boostControl[lab.id].countdown = Game.time;
            }
        }
        console.log('boost: mission sended, waiting resources');
        room.memory.boostController.stage = 'wait_resource';
    }

    if (room.memory.boostController.stage == 'wait_resource') {
        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);

            if (lab.store[entry.type] < 1500) {
                return;
            }

            if (lab.store[RESOURCE_ENERGY] < 1000) {
                return;
            }

        }
        room.memory.boostController.stage = 'wait_creep';
    }

    if (room.memory.boostController.stage == 'wait_creep') {
        let creep = Game.getObjectById(room.memory.boostController.currentBoostCreep.id);
        if (!creep) {
            room.memory.boostController.stage = 'failed';
            console.log('warning, can not find the corresponding creep');
            return;
        }
        let flag = Game.flags[`boost 1 ${room.name}`];
        if (!flag) {
            room.memory.boostController.stage = 'failed';
            console.log('warning, can not find the corresponding flag');
            return;
        }
        flag = Game.flags[`boost 2 ${room.name}`];
        if (!flag) {
            room.memory.boostController.stage = 'failed';
            console.log('warning, can not find the corresponding flag');
            return;
        }

        creep.memory.boostStage = 'prepared';
        room.memory.boostController.stage = 'boosting';
    }

    if (room.memory.boostController.stage == 'boosting') {
        let creep = Game.getObjectById(room.memory.boostController.currentBoostCreep.id);
        let flag = Game.flags[`boost 1 ${room.name}`];
        if (!creep) {
            room.memory.boostController.stage = 'failed';
            return;
        }
        if (!creep.pos.isEqualTo(flag.pos)) {
            // keep checking
            creep.goTo(flag.pos, 0);
            room.memory.boostController.countdown = 1;
            return;
        }

        let res = true;
        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);

            let ret = lab.boostCreep(creep);
            if (ret != OK) {
                console.log(`failed to boost creep ${ret}`);
                res = false;
            }
        }

        if (res) {
            creep.memory.boostStage = 'ok';
            room.memory.boostController.stage = 'wait'
        } else {
            room.memory.boostController.stage = 'boosting2';
        }
    }
    
    if (room.memory.boostController.stage == 'boosting2') {
        let creep = Game.getObjectById(room.memory.boostController.currentBoostCreep.id);
        let flag = Game.flags[`boost 2 ${room.name}`];
        if (!creep) {
            room.memory.boostController.stage = 'failed';
            return;
        }
        if (!creep.pos.isEqualTo(flag.pos)) {
            // keep checking
            creep.goTo(flag.pos, 0);
            room.memory.boostController.countdown = 1;
            return;
        }

        let res = true;
        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);

            let ret = lab.boostCreep(creep);
            if (ret != OK && ret != ERR_NOT_IN_RANGE) {
                console.log(`failed to boost creep ${ret}`);
                res = false;
            }
        }

        if (res) {
            creep.memory.boostStage = 'ok';
            room.memory.boostController.stage = 'wait'
        } else {
            room.memory.boostStage = 'failed';
        }
    }

    if (room.memory.boostController.stage == 'failed') {
        // not enough resources or labs
        // we can simply drop this mission
        let creep = Game.getObjectById(room.memory.boostController.currentBoostCreep.id);
        if (creep) {
            creep.memory.boostStage = "failed";
        }
        room.memory.boostController.stage = 'wait';
        return;
    }
}

function warController(room) {
    if (room.memory.labController == undefined) {
        return;
    }

    if (room.memory.boostController == undefined) {
        return;
    }

    if (room.memory.warController == undefined) {
        room.memory.warController = {
            stage: 'init',
            enabled: false,
        }
    }

    if (room.memory.warController.enabled == false) {
        return;
    }

    room.memory.labController.enabled = false;
    room.memory.boostController.enabled = false;
    const warReloadCountdown = 50;

    const boostResource = ['XZHO2', 'XKHO2', 'XUH2O', 'XLHO2', 'XGHO2'];
    if (room.memory.warController.stage == 'init') {
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let id = room.memory.labController.labs[i];
            room.memory.labController.boostControl[id].enabled = false;
        }

        room.memory.boostController.boostEntry = new Array();
        for (let res of boostResource) {
            // check whether the boosting lab have already had this resource
            let check = false;
            for (let i = 0; i < room.memory.labController.labs.length; i++) {
                let id = room.memory.labController.labs[i];
                let lab = Game.getObjectById(id);
                if (!room.memory.labController.boostControl[id].enabled) {
                    if (lab.store[lab.mineralType] > 0 && lab.mineralType == res) {
                        check = true;
                        room.memory.boostController.boostEntry.push({
                            type: res,
                            id: lab.id,
                        });
                        room.memory.labController.boostControl[id].enabled = true;
                        break;
                    }
                }
            }
            
            if (check) {
                continue;
            }

            // otherwise, we need to find a victim
            for (let i = 0; i < room.memory.labController.labs.length; i++) {
                let id = room.memory.labController.labs[i];
                if (!room.memory.labController.boostControl[id].enabled) {
                    room.memory.labController.boostControl[id].enabled = true;
                    room.memory.labController.missionControl[id] = false;
                    room.memory.boostController.boostEntry.push({
                        type: res,
                        id: id
                    });
                    console.log(`find victim ${id}`);
                    check = true;
                    break;
                }
            }

            if (!check) {
                console.log('failed to boost due to not enough labs');
                room.memory.warController.stage = 'failed';
                break;
            }
            
        }

        if (room.memory.warController.stage != 'failed') {
            // sanity check
            room.memory.warController.stage = 'send_mission';
        }
    }

    if (room.memory.warController.stage == 'send_mission') {
        let storage = room.storage;
        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);
            // clear lab first
            if (lab.mineralType != entry.type && lab.store[lab.mineralType] > 0) {
                room.memory.task_queue.push({
                    from: lab.id,
                    to: storage.id,
                    type: lab.mineralType,
                    amount: lab.store[lab.mineralType]
                });
            }

            if (lab.store[entry.type] < 3000) {
                room.memory.task_queue.push({
                    from: storage.id,
                    to: lab.id,
                    type: entry.type,
                    amount: 3000 - lab.store[entry.type]
                });
                room.memory.labController.boostControl[lab.id].countdown = Game.time;
            }

            if (lab.store[RESOURCE_ENERGY] < 2000) {
                room.memory.task_queue.push({
                    from: storage.id,
                    to: lab.id,
                    type: RESOURCE_ENERGY,
                    amount: 2000 - lab.store[RESOURCE_ENERGY],
                });
                room.memory.labController.boostControl[lab.id].countdown = Game.time;
            }
        }
        console.log('boost: mission sended, waiting resources');
        room.memory.warController.stage = 'wait_resource';
    }

    if (room.memory.warController.stage == 'wait_resource') {
        for (let i = 0; i < room.memory.boostController.boostEntry.length; i++) {
            let entry = room.memory.boostController.boostEntry[i];
            let lab = Game.getObjectById(entry.id);

            if (lab.store[entry.type] < 3000) {
                return;
            }

            if (lab.store[RESOURCE_ENERGY] < 2000) {
                return;
            }

        }
        room.memory.warController.stage = 'war';
    }

    if (room.memory.warController.stage == 'war') {
        room.memory.boostController.enabled = true;
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let id = room.memory.labController.labs[i];
            if (room.memory.labController.boostControl[id].enabled) {
                if (Game.time - room.memory.labController.boostControl[id].countdown < warReloadCountdown) {
                    continue;
                }

                let storage = room.storage;
                let lab = Game.getObjectById(id);
                if (lab.store[lab.mineralType] < 3000) {
                    room.memory.task_queue.push({
                        from: storage.id,
                        to: lab.id,
                        type: lab.mineralType,
                        amount: 3000 - lab.store[lab.mineralType]
                    });
                }

                if (lab.store[RESOURCE_ENERGY] < 2000) {
                    room.memory.task_queue.push({
                        from: storage.id,
                        to: lab.id,
                        type: RESOURCE_ENERGY,
                        amount: 2000 - lab.store[RESOURCE_ENERGY],
                    });
                }
                room.memory.labController.boostControl[lab.id].countdown = Game.time;
            }
        }
    }

    if (room.memory.warController.stage == 'failed') {
        room.memory.warController.enabled = false;
        return;
    }
}

function defendController(room) {
    let target = room.find(FIND_HOSTILE_CREEPS, {
        filter: (c) => {
            // not whiteList player, neither invader
            return whiteList.indexOf(c.owner.username) == -1 &&
                    c.owner.username != 'Invader' &&
                    (containBodyPart(c, 'attack') || containBodyPart(c, 'ranged_attack'));
        }
    });
    if (target.length > 0) {
        if (room.safeMode == undefined) {
            room.controller.activateSafeMode();
            Game.notify(`warning, ${target[0].owner.username} is attacking you, generating safemode`);
        }
    }
}

function interRoomTransmissionController(room) {
    if (room.memory.transmission_queue == undefined) {
        room.memory.transmission_queue = new Array();
    }

    if (room.memory.center_task_queue == undefined) {
        room.memory.center_task_queue = new Array();
    }

    if (room.memory.current_transmission_task == undefined) {
        if (room.memory.transmission_queue.length > 0) {
            room.memory.current_transmission_task = room.memory.transmission_queue[0];
            room.memory.current_transmission_task.stage = 'check';
            room.memory.current_transmission_task.time = Game.time;
            room.memory.transmission_queue.shift();
            console.log('accept transmission task');
        } else {
            return
        }
    }

    let terminal = room.terminal;
    let storage = room.storage;
    if (!terminal || !storage) {
        return;
    }

    let task = room.memory.current_transmission_task;
    if (!task.time || Game.time - task.time > 500) {
        console.log('abort transmission task due to timed out');
        room.memory.current_transmission_task = undefined;
        return;
    }

    if (task.stage == 'check') {
        if (task.type == 'energy') {
            if (terminal.store[task.type] > task.amount * 2) {
                let ret = terminal.send(task.type, task.amount, task.to);
                if (ret == OK) {
                    console.log(`send ${task.amount} ${task.type} from ${task.from} to ${task.to} success`);
                    room.memory.current_transmission_task = undefined;
                    return;
                } else {
                    console.log(`${ret} failed to send ${task.amount} ${task.type} from ${task.from} to ${task.to}`);
                    room.memory.current_transmission_task = undefined;
                    return;
                }
            } else {
                room.memory.center_task_queue.push({
                    from: storage.id,
                    to: terminal.id,
                    type: task.type,
                    amount: task.amount * 2 - terminal.store[task.type]
                });
                room.memory.current_transmission_task.stage = 'wait';
                return;
            }
        } else {
            if (terminal.store[task.type] > task.amount && terminal.store[RESOURCE_ENERGY] > task.amount) {
                let ret = terminal.send(task.type, task.amount, task.to);
                if (ret == OK) {
                    console.log(`send ${task.amount} ${task.type} from ${task.from} to ${task.to} success`);
                    room.memory.current_transmission_task = undefined;
                    return;
                } else {
                    console.log(`${ret} failed to send ${task.amount} ${task.type} from ${task.from} to ${task.to}`);
                    room.memory.current_transmission_task = undefined;
                    return;
                }
            } else {
                if (storage.store[task.type] > task.amount) {
                    // send task
                    if (terminal.store[task.type] < task.amount) {
                        room.memory.center_task_queue.push({
                            from: storage.id,
                            to: terminal.id,
                            type: task.type,
                            amount: task.amount - terminal.store[task.type]
                        });
                    }
                    if (terminal.store[RESOURCE_ENERGY] < task.amount) {
                        room.memory.center_task_queue.push({
                            from: storage.id,
                            to: terminal.id,
                            type: RESOURCE_ENERGY,
                            amount: task.amount - terminal.store[RESOURCE_ENERGY]
                        });
                    }
                    room.memory.current_transmission_task.stage = 'wait';
                    return;
                } else {
                    console.log(`failed to send ${task.amount} ${task.type} from ${task.from} to ${task.to}, resource not enough`);
                    room.memory.current_transmission_task = undefined;
                    return;
                }
            }
        }
    }

    if (task.stage == 'wait') {
        if (task.type == 'energy') {
            if (terminal.store[task.type] >= task.amount * 2) {
                let ret = terminal.send(task.type, task.amount, task.to);
                if (ret == OK) {
                    console.log(`send ${task.amount} ${task.type} from ${task.from} to ${task.to} success`);
                    room.memory.current_transmission_task = undefined;
                    return;
                } else {
                    console.log(`${ret} failed to send ${task.amount} ${task.type} from ${task.from} to ${task.to}`);
                    room.memory.current_transmission_task = undefined;
                    return;
                }
            }
        } else {
            if (terminal.store[task.type] >= task.amount && terminal.store[RESOURCE_ENERGY] >= task.amount) {
                let ret = terminal.send(task.type, task.amount, task.to);
                if (ret == OK) {
                    console.log(`send ${task.amount} ${task.type} from ${task.from} to ${task.to} success`);
                    room.memory.current_transmission_task = undefined;
                    return;
                } else {
                    console.log(`${ret} failed to send ${task.amount} ${task.type} from ${task.from} to ${task.to}`);
                    room.memory.current_transmission_task = undefined;
                    return;
                }
            }
        }
    }
}

const maxTransferAmount = 5000;

function terminalController(room) {
    let terminal = room.terminal;
    let storage = room.storage;
    if (!terminal || !storage) {
        return;
    }

    if (room.memory.current_transmission_task) {
        return;
    }

    if (room.memory.center_task_queue == undefined) {
        room.memory.center_task_queue = new Array();
    }

    if (room.memory.center_task_queue.length > 0) {
        return;
    }

    let flag = Game.flags[`center ${room.name}`];
    if (!flag) {
        return;
    }
    let creeps = flag.pos.lookFor(LOOK_CREEPS);
    if (creeps.length == 0) {
        return;
    }

    if (creeps[0].memory.stage != undefined && creeps[0].memory.stage != 'wait') {
        return;
    }

    if (terminal.store[RESOURCE_ENERGY] > 50000) {
        let amount = Math.min(terminal.store[RESOURCE_ENERGY] - 50000, maxTransferAmount);
        room.memory.center_task_queue.push({
            from: terminal.id,
            to: storage.id,
            type: RESOURCE_ENERGY,
            amount: amount
        });
        console.log(`send mission send energy ${amount}`);
        return;
    } else if (terminal.store[RESOURCE_ENERGY] < 20000) {
        let amount = Math.min(20000 - terminal.store[RESOURCE_ENERGY], maxTransferAmount);
        room.memory.center_task_queue.push({
            from: storage.id,
            to: terminal.id,
            type: RESOURCE_ENERGY,
            amount: amount
        });
        console.log(`send mission send energy ${amount}`);
        return;
    }

    for (let resourceType in terminal.store) {
        if (resourceType == RESOURCE_ENERGY) {
            continue;
        }

        if (terminal.store[resourceType] > 0) {
            let amount = Math.min(terminal.store[resourceType], maxTransferAmount);
            room.memory.center_task_queue.push({
                from: terminal.id,
                to: storage.id,
                type: resourceType,
                amount: amount
            });
            console.log(`send mission ${resourceType} ${amount}`);
            return;
        }
    }
}

function mineralController(room) {
    if (room.controller.level < 6) {
        return;
    }

    if (room.memory.mineralControl == undefined) {
        room.memory.mineralControl = {
            working: false,
            countdown: 0,
        }
    }

    room.memory.mineralControl.countdown--;
    if (room.memory.mineralControl.countdown > 0) {
        return;
    }
    // 100 tick cooldown
    room.memory.mineralControl.countdown = 100;

    let mineral = room.find(FIND_MINERALS);
    if (mineral.length == 0) {
        return;
    }

    let extractor = mineral[0].pos.lookFor(LOOK_STRUCTURES).find(s => s.structureType == STRUCTURE_EXTRACTOR);
    if (!extractor) {
        return;
    }

    if (mineral[0].mineralAmount > 0) {
        if (!room.memory.mineralControl.working) {
            G_roomSpawn('miner', room.name, true, 150, {});
            console.log('detect mineral, sending miner');
            room.memory.mineralControl.working = true;
        }
    } else {
        room.memory.mineralControl.working = false;
    }
}

function runPowerSquad(room, squad) {
    if (squad.stage == 'init') {
        if (squad.id == undefined) {
            console.log('can not find squad id');
            return;
        }

        let flag = Game.flags[`power ${squad.id} ${room.name}`];
        if (!flag) {
            console.log('can not find squad flag');
            return;
        }

        roomSpawn('power_attacker', room.name, false, 1, {
            squadId: squad.id, needBoost: true, boostResource: ['UH2O']
        });
        roomSpawn('power_healer', room.name, false, 1, {
            squadId: squad.id, needBoost: true, boostResource: ['XLHO2']
        });
        console.log('sending power squad');
        squad.stage = 'work';
    }

    if (squad.stage == 'work') {
        let flag = Game.flags[`power ${squad.id} ${room.name}`];
        let target_room = Game.rooms[flag.pos.roomName];
        if (!target_room) {
            return;
        }

        if (!squad.powerbank) {
            let bk = getStructureByFlag(flag, STRUCTURE_POWER_BANK);
            if (bk) {
                squad.powerbank = bk.id;
            }
        }

        let powerbank = Game.getObjectById(squad.powerbank);
        if (!powerbank) {
            return;
        }
        if (powerbank.hits < 300000) {
            let num = Math.ceil(powerbank.power / 1600);
            for (let i = 0; i < num; i++) {
                roomSpawn('power_retriever', room.name, false, 1, {squadId: squad.id});
            }
            console.log('sending power retriever');
            squad.stage = 'done';
        }
    }

}

function powerController(room) {
    if (room.memory.powerController == undefined) {
        room.memory.powerController = {
            powerSquad: {}
        }
    }

    for (let squad_id in room.memory.powerController.powerSquad) {
        let squad = room.memory.powerController.powerSquad[squad_id]
        if (squad.stage == 'done') {
            delete squad
            continue;
        }
        runPowerSquad(room, squad);
    }
}

module.exports = {
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
    powerController
};

// let task = {
//     role: 'distant_transfer',
//     roomname: creep.memory.roomname,
//     isNeeded: true,
//     respawnTime: creep.memory.respawnTime,
//     extraInfo: creep.memory.extraInfo
// }
// Game.rooms[creep.memory.roomname].memory.spawn_queue.push(task);
// console.log(`building mission in ${creep.memory.extraInfo.working_room} is done, calling transfer`);