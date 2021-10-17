function reserveController(room) {
    for (let room_name in room.memory.reserve_rooms) {
        let reserve_room = Game.rooms[room_name];
        if (reserve_room && room.memory.reserve_rooms[room_name] == 0) {
            room.memory.reserve_rooms[room_name] = 300;
            if (reserve_room.controller.reservation.username != 'heavensheep' || reserve_room.controller.reservation.ticksToEnd < 300) {
                console.log(`detected ${reserve_room} need reserver, sending mission`);
                room.memory.spawn_queue.push({
                    role: 'claimer', 
                    roomname: room.name, 
                    isNeeded: false, 
                    respawnTime: 100, 
                    extraInfo: {working_room: room_name}
                });
                room.memory.reserve_rooms[room_name] += 300;
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

    if (room.memory.buildInfo.counter <= 0) {
        room.memory.buildInfo.counter = 200;
        let target = room.find(FIND_CONSTRUCTION_SITES);
        if (target.length > 0) {
            if (!room.memory.buildInfo.building) {
                console.log('detected construction sites, sending building mission');
                if (room.storage) {
                    let task = {
                        role: 'builder',
                        roomname: room.name,
                        isNeeded: true,
                        respawnTime: 80,
                        extraInfo: {}
                    }
                    // two builder
                    room.memory.spawn_queue.push(task);
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

module.exports = {
    reserveController,
    buildController
};