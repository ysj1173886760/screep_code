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

module.exports = {
    getStructureByFlag,
    getConstructionSite,
    findNearbyStuff,
    upgradeController,
    testGlobalFunction,
    roomSpawn
}