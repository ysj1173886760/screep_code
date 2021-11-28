const { transform } = require('lodash');
var {getStructureByFlag} = require('utils');

module.exports = {
    callback: {
        powerSpawnCallback: function(creep, args) {
            if (!args) {
                return;
            }

            let room = creep.room;
            if (!room.memory.powerSpawnController) {
                return;
            }

            room.memory.powerSpawnController[args.type] = false;
            console.log(`doing powerSpawn callback ${args.type}`);
        }
    },
    run: function(creep) {
        if (creep.memory.transfer && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfer = false;
        }

        if (!creep.memory.transfer && creep.store.getUsedCapacity() != 0) {
            creep.memory.transfer = true;
        }

        if (!creep.room.storage) {
            return;
        }

        creep.memory.standed = true;
        // initialize part
        let flag = Game.flags[`center ${creep.room.name}`];
        if (!creep.pos.isEqualTo(flag.pos)) {
            creep.goTo(flag.pos, 0);
            return;
        }

        if (creep.memory.link == undefined) {
            let target_link = getStructureByFlag(Game.flags[`target_link ${creep.room.name}`], STRUCTURE_LINK);
            if (target_link) {
                creep.memory.link = target_link.id;
            }
        }

        let target_link = Game.getObjectById(creep.memory.link);
        if (target_link && target_link.store.getUsedCapacity(RESOURCE_ENERGY) != 0 && creep.store.getUsedCapacity() == 0) {
            creep.withdraw(target_link, RESOURCE_ENERGY);
            creep.memory.transferLink = true;
            return;
        }
        if (creep.memory.transferLink) {
            if (creep.room.storage.store.getFreeCapacity() == 0) {
                creep.transfer(creep.room.terminal, RESOURCE_ENERGY)
            } else {
                creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            }
            
            creep.memory.transferLink = false;
            return;
        }

        if (creep.store.getUsedCapacity() != 0 && creep.room.memory.center_task == undefined) {
            if (creep.room.storage.store.getFreeCapacity() == 0) {
                creep.exTransferAll(creep.room.terminal)
            } else {
                creep.exTransferAll(creep.room.storage);
            }
            creep.say('transfer');
            return;
        }

        if (creep.store.getUsedCapacity() != 0 && creep.room.memory.center_task && creep.store[creep.room.memory.center_task.type] == 0) {
            creep.exTransferAll(creep.room.storage);
            creep.say('transfer');
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity(creep.room.memory.center_task.type) == 0) {
            creep.room.memory.center_task.amount -= creep.memory.amount;
            if (creep.room.memory.center_task.amount <= 0) {
                if (creep.room.memory.center_task.callback != undefined) {
                    this.callback[creep.room.memory.center_task.callback.name](creep, creep.room.memory.center_task.callback.args);
                }
                creep.room.memory.center_task = undefined;
                creep.memory.stage = 'wait';
                creep.say('complete');
            } else {
                creep.memory.stage = 'withdraw';
                creep.say('continue');
            }
        }


        if (creep.memory.stage == undefined || creep.memory.stage == 'wait') {
            let room = Game.rooms[creep.memory.roomname];
            if (room.memory.center_task_queue == undefined) {
                room.memory.center_task_queue = new Array();
            }

            if (creep.ticksToLive < 10) {
                creep.say('killing myself');
                creep.suicide();
                return;
            }

            if (creep.room.memory.center_task == undefined) {
                if (room.memory.center_task_queue.length > 0) {
                    creep.room.memory.center_task = room.memory.center_task_queue[0];
                    room.memory.center_task_queue.shift();
                    creep.memory.stage = 'withdraw';
                    console.log(`mission acquired, transfer ${creep.room.memory.center_task.amount} ${creep.room.memory.center_task.type}`);
                }
            } else {
                creep.memory.stage = 'withdraw';
            }
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity(creep.room.memory.center_task.type) != 0) {
            creep.memory.stage = 'transfer';
            creep.memory.amount = creep.store.getUsedCapacity(creep.room.memory.center_task.type);
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity(creep.room.memory.center_task.type) == 0) {
            let target = Game.getObjectById(creep.room.memory.center_task.from);

            let amount = Math.min(creep.store.getFreeCapacity(), creep.room.memory.center_task.amount);
            creep.say(amount);
            if (amount < 0) {
                creep.room.memory.center_task = undefined;
                creep.memory.stage = 'wait';
                return;
            }
            
            let ret = creep.withdraw(target, creep.room.memory.center_task.type, amount);
            if (ret == ERR_NOT_IN_RANGE) {
                creep.goTo(target.pos, 1);
            } else if (ret == ERR_NOT_ENOUGH_RESOURCES || ret == ERR_INVALID_TARGET) {
                creep.room.memory.center_task = undefined;
                creep.memory.stage = 'wait';
                return;
            } else if (ret == ERR_FULL) {
                creep.exTransferAll(creep.room.storage);
            }
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity(creep.room.memory.center_task.type) != 0) {
            let target = Game.getObjectById(creep.room.memory.center_task.to);
            let ret = creep.transfer(target, creep.room.memory.center_task.type);
            if (ret == ERR_NOT_IN_RANGE) {
                // creep.moveTo(target);
                creep.goTo(target.pos, 1);
            } else if (ret == ERR_FULL) {
                console.log(`${creep.name} abort the mission due to the lack of space`);
                creep.room.memory.center_task = undefined;
                creep.memory.stage = 'wait';
            }
            return;
        }
    }
}