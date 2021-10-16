function reserveController(room) {
    for (let room_name in room.memory.reserve_rooms) {
        let reserve_room = Game.rooms[room_name];
        if (reserve_room && room.memory.reserve_rooms[room_name] == 0) {
            if (reserve_room.controller.reservation.username != 'heavensheep' || reserve_room.controller.reservation.ticksToEnd < 300) {
                console.log(`detected ${reserve_room} need reserver, sending mission`);
                room.memory.spawn_queue.push({
                    role: 'claimer', 
                    roomname: room.name, 
                    isNeeded: false, 
                    respawnTime: 100, 
                    extraInfo: {working_room: room_name}});
            }
            room.memory.reserve_rooms[room_name] = 300;
        }
        room.memory.reserve_rooms[room_name]--;
    }
}

module.exports = {reserveController};