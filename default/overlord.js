const { getStructureByFlag } = require("./utils");

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

        console.log(`creating order for ${room.name}, buying ${amount} energy for ${sum}`)
    }
}

function labReactionController(room) {
    if (room.memory.task_queue == undefined) {
        room.memory.task_queue = new Array();
    }

    if (room.memory.labController == undefined) {
        let flag1 = Game.flags[`lab 1 ${room.name}`];
        let flag2 = Game.flags[`lab 2 ${room.name}`];
        let lab1 = getStructureByFlag(flag1, STRUCTURE_LAB);
        let lab2 = getStructureByFlag(flag2, STRUCTURE_LAB);
        let labs = room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_LAB && 
                        s.id != lab1.id &&
                        s.id != lab2.id;
            }
        })
        room.memory.labController = {
            lab1: lab1.id,
            lab2: lab2.id,
            labs: labs,
            stage: 'check',
            countdown: 5
        };
    }

    room.memory.labController.countdown--;
    if (room.memory.labController.countdown != 0) {
        return;
    }

    room.memory.labController.countdown = 5;
    let res1 = RESOURCE_LEMERGIUM;
    let res2 = RESOURCE_UTRIUM;

    if (room.memory.labController.stage == 'check') {
        let storage = room.storage;
        if (storage.store[res1] < 1000) {
            return;
        }

        if (storage.store[res2] < 1000) {
            return;
        }

        if (storage.store[RESOURCE_ENERGY] < 100000) {
            return;
        }

        let lab1 = Game.getObjectById(room.memory.labController.lab1.id);
        let lab2 = Game.getObjectById(room.memory.labController.lab2.id);
        let task = {
            from: storage.id,
            to: lab1.id,
            type: res1,
            amount: 1000
        }
        room.memory.task_queue.push(task);

        task = {
            from: storage.id,
            to: lab2.id,
            type: res2,
            amount: 1000
        }
        room.memory.task_queue.push(task);

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
            if (lab.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                task = {
                    from: storage.id,
                    to: lab.id,
                    type: RESOURCE_ENERGY,
                    amount: lab.store.getFreeCapacity(RESOURCE_ENERGY)
                }
                room.memory.task_queue.push(task);
            }
        }

        room.memory.labController.stage = 'prepare';
    }

    if (room.memory.labController.stage == 'prepare') {
        let lab1 = Game.getObjectById(room.memory.labController.lab1.id);
        let lab2 = Game.getObjectById(room.memory.labController.lab2.id);

        if (lab1.store[res1] < 1000) {
            return;
        }
        if (lab2.store[res2] < 1000) {
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
            if (lab.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                return;
            }
        }

        room.memory.labController.stage = 'work';
    }

    if (room.memory.labController.stage == 'work') {
        let res = false;
        let lab1 = Game.getObjectById(room.memory.labController.lab1.id);
        let lab2 = Game.getObjectById(room.memory.labController.lab2.id);
        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            let ret = lab.runReaction(lab1, lab2);

            if (ret == OK) {
                res = true;
            } else if (ret == ERR_TIRED) {
                return;
            }
        }
        
        if (!res) {
            room.memory.labController.stage = 'retrieve';
        }
    }

    if (room.memory.labController.stage == 'retrieve') {
        let lab1 = Game.getObjectById(room.memory.labController.lab1.id);
        let lab2 = Game.getObjectById(room.memory.labController.lab2.id);
        let storage = room.storage;

        if (lab1.store[res1] > 0) {
            room.memory.task_queue.push({
                from: lab1.id,
                to: storage.id,
                type: res1,
                amount: lab1.store[res1]
            });
        }

        if (lab1.store[res2] > 0) {
            room.memory.task_queue.push({
                from: lab2.id,
                to: storage.id,
                type: res2,
                amount: lab2.store[res2]
            });
        }

        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
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
        if (lab1.store[res1] > 0) {
            return;
        }

        if (lab1.store[res2] > 0) {
            return;
        }

        for (let i = 0; i < room.memory.labController.labs.length; i++) {
            let lab = Game.getObjectById(room.memory.labController.labs[i]);
            for (let resourceType in lab.store) {
                if (lab.store[resourceType] > 0 && resourceType != RESOURCE_ENERGY) {
                    return;
                }
            }
        }

        room.memory.labController.stage = 'check';
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