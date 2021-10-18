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

module.exports = {
    getStructureByFlag,
    getConstructionSite,
    findNearbyStuff,
    upgradeController,
    testGlobalFunction,
    roomSpawn,
    getRole,
    printRoomInfo,
    removeAll
}