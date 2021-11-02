
function getStructureByFlag(flag, STRUCTURE_TYPE) {
    if (!flag) { 
        return;
    }
    let target = flag.room.lookForAt(LOOK_STRUCTURES, flag.pos.x, flag.pos.y);
    return target.find(s => s.structureType == STRUCTURE_TYPE);
}

function getConstructionSite(creep) {
    let target = creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, creep.pos.x, creep.pos.y);
    return target[0];
}

function findNearbyStuff(creep, type, range) {
    let target = creep.pos.findInRange(type, range);
    if (target.length > 0) {
        return target[0];
    }
    return target;
}

function upgradeController(creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

function roomSpawn(role, roomname, isNeeded, respawnTime, extraInfo) {
    let room = Game.rooms[roomname];
    if (!room) {
        console.log('can not find the room');
        return false;
    }
    if (typeof respawnTime != 'number') {
        return false;
    }
    
    room.memory.spawn_queue.push({
        role: role, 
        roomname: roomname, 
        isNeeded: isNeeded, 
        respawnTime: respawnTime, 
        extraInfo: extraInfo
    });
    return true;
}

function testGlobalFunction() {
    console.log("test success");
    return true;
}

function getRole(roomname, role) {
    return _.filter(Game.creeps, (c) => (c.memory.role == role && c.memory.roomname == roomname));
}

function removeAll(roomname, role) {
    let target = getRole(roomname, role);
    for (let name in target) {
        let creep = target[name];
        creep.memory.isNeeded = false;
    }
    return true;
}

function printRoomInfo(roomname) {
    let room = Game.rooms[roomname];
    let creeps = _.filter(Game.creeps, (c) => (c.memory.roomname == roomname));
    for (let name in creeps) {
        let creep = creeps[name];
        console.log(creep.memory.role, creep.memory.isNeeded);
        for (let extra in creep.memory.extraInfo) {
            let info = creep.memory.extraInfo[extra];
            console.log(extra, info);
        }
    }
}

function printRoomRoleInfo(roomname, role) {
    let room = Game.rooms[roomname];
    let creeps = _.filter(Game.creeps, (c) => (c.memory.roomname == roomname));
    for (let name in creeps) {
        let creep = creeps[name];
        if (creep.memory.role != role) {
            continue;
        }
        console.log(`role: ${creep.memory.role}, isNeeded: ${creep.memory.isNeeded}, respawnTime: ${creep.memory.respawnTime}`);
        console.log('extra...............')
        for (let extra in creep.memory.extraInfo) {
            let info = creep.memory.extraInfo[extra];
            console.log(extra, info);
        }
        console.log('................')
    }
}

function removeRole(roomname, role) {
    let room = Game.rooms[roomname];
    let queue = room.memory.spawn_queue;
    console.log(`before delete..........`);
    for (let i = 0; i < queue.length; i++) {
        console.log(queue[i].role);
    }
    for (let i = 0; i < queue.length; i++) {
        if (queue[i].role == role) {
            room.memory.spawn_queue.splice(i, 1);
            break;
        }
    }
    console.log(`after delete.........`);
    for (let i = 0; i < room.memory.spawn_queue.length; i++) {
        console.log(room.memory.spawn_queue[i].role);
    }
}

function printSpawnQueue(roomname) {
    let room = Game.rooms[roomname];
    let queue = room.memory.spawn_queue;
    for (let i = 0; i < queue.length; i++) {
        console.log(queue[i].role);
    }
}

function addReserve(roomname, target_room) {
    let room = Game.rooms[roomname];
    room.memory.reserve_rooms[target_room] = 0;
    console.log('adding reserve room');
}

function removeReserve(roomname, target_room) {
    let room = Game.rooms[roomname];
    room.memory.reserve_rooms[target_room] = undefined;
    console.log('removing reserve room');
}

// G_createOrder(ORDER_SELL, CPU_UNLOCK, 16111111, 1, '')
function createOrder(type, resourceType, price, totalAmount, roomName) {
    res = Game.market.createOrder({
        type: type,
        resourceType: resourceType,
        price: price,
        totalAmount: totalAmount,
        roomName: roomName
    });
    console.log(res);
}

function getBodyParts(body) {
    let res = new Array();
    for (let name in body) {
        for (let i = 0; i < body[name]; i++) {
            res.push(name);
        }
    }
    return res;
}

function removeSquad(id) {
    for (let i = 0; i < Memory.squads.length; i++) {
        if (Memory.squads[i].id == id) {
            Memory.squads.splice(i, 1);
            return true;
        }
    }
    return false;
}

function addSquad(id) {
    for (let i = 0; i < Memory.squads.length; i++) {
        if (Memory.squads[i].id == id) {
            return false;
        }
    }
    Memory.squads.push({id: id});
    return true;
}

function containBodyPart(creep, bodyPart) {
    for (let i = 0; i < creep.body.length; i++) {
        if (creep.body[i].type == bodyPart) {
            return true;
        }
    }
    return false;
}

function roomSend(from, to, resourceType, amount) {
    let room = Game.rooms[from];
    if (!room || !room.terminal) {
        return;
    }
    room.memory.transmission_queue.push({
        from: from,
        to: to,
        type: resourceType,
        amount: amount
    });
    console.log("mission sended");
}

function enableLab(roomname) {
    let room = Game.rooms[roomname];
    if (!room) {
        return;
    }
    room.memory.labController.enabled = true;
}

function setReaction(roomname, res1, res2) {
    let room = Game.rooms[roomname];
    if (!room) {
        return;
    }
    room.memory.labController.current_mission = {
        res1: res1,
        res2: res2,
    }
    room.memory.labController.stage = 'check';
    room.memory.labController.enabled = false;
}

function setBoost(roomname, value) {
    let room = Game.rooms[roomname];
    if (!room) {
        return;
    }

    if (value) {
        room.memory.boostController.enabled = true;
        room.memory.boostController.stage = 'wait';
    } else {
        for (let id in room.memory.labController.boostControl) {
            if (room.memory.labController.boostControl[id].enabled) {
                room.memory.labController.boostControl[id].enabled = false;
                console.log(`disable lab boost ${id}`);
            }
        }
        room.memory.boostController.enabled = false;
        room.memory.boostController.stage = 'wait';
    }
    return true;
}

function setWar(roomname, value) {
    let room = Game.rooms[roomname];
    if (!room) {
        return;
    }

    setBoost(roomname, value);

    room.memory.warController.stage = 'init';
    room.memory.warController.enabled = value;
}

function getOppositeDirection(direction) {
    return (direction + 3) % 8 + 1;
}

function setBoostUpgrade(roomname, value) {
    let room = Game.rooms[roomname];
    if (!room) {
        return;
    }

    room.memory.boostUpgrade.enable = value;
    return true;
}

module.exports = {
    getStructureByFlag,
    getConstructionSite,
    findNearbyStuff,
    upgradeController,
    testGlobalFunction,
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
    getBodyParts,
    removeSquad,
    addSquad,
    containBodyPart,
    roomSend,
    enableLab,
    setReaction,
    setBoost,
    getOppositeDirection,
    setWar,
    setBoostUpgrade,
}