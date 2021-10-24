function reserveController(room) {
    if (room.memory.reserve_rooms == undefined) {
        room.memory.reserve_rooms = {};
    }

    for (let room_name in room.memory.reserve_rooms) {
        let reserve_room = Game.rooms[room_name];
        if (reserve_room && room.memory.reserve_rooms[room_name] == 0) {
            room.memory.reserve_rooms[room_name] = 100;
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

        console.log(`creating order for ${room.name}, buying ${amount} energy for ${price}`)
    }
}

module.exports = {
    reserveController,
    buildController,
    boostUpgradingController
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