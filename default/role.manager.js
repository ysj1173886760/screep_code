var manager = {
    run: function(creep) {
        if (creep.store.getUsedCapacity() != 0 && creep.memory.extraInfo.task == undefined) {
            creep.exTransferAll(creep.room.storage);
            creep.say('transfer');
            return;
        }

        if (creep.memory.stage == undefined || creep.memory.stage == 'wait') {
            let room = Game.rooms[creep.memory.roomname];
            if (room.memory.task_queue == undefined) {
                room.memory.task_queue = new Array();
            }

            if (creep.ticksToLive < 100) {
                creep.say('killing myself');
                creep.suicide();
                return;
            }

            if (creep.memory.extraInfo.task == undefined) {
                if (room.memory.task_queue.length > 0) {
                    creep.memory.extraInfo.task = room.memory.task_queue[0];
                    room.memory.task_queue.shift();
                    creep.memory.stage = 'check';
                    console.log(`${creep.name} mission acquired, transfer ${creep.memory.extraInfo.task.amount} ${creep.memory.extraInfo.task.type}`);
                }
            } else {
                creep.memory.stage = 'check';
            }

            if (creep.memory.stage == 'wait') {
                // creep.moveTo(room.storage);
                creep.goTo(room.storage.pos, 1);
            }
            return;
        }

        if (creep.memory.stage == 'check') {
            let from = Game.getObjectById(creep.memory.extraInfo.task.from);
            let to = Game.getObjectById(creep.memory.extraInfo.task.to);
            if (from.store[creep.memory.extraInfo.task.type] < creep.memory.extraInfo.task.amount) {
                console.log(`${creep.room.name} abort mission due to lack of source`);
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
                return;
            }

            if (to.store.getFreeCapacity(creep.memory.extraInfo.task.type) == 0) {
                console.log(`${creep.room.name} abort mission due to not enough space`);
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
                return;
            }

            if (to.store.getFreeCapacity(creep.memory.extraInfo.task.type) < creep.memory.extraInfo.task.amount) {
                creep.memory.extraInfo.task.amount = to.store.getFreeCapacity(creep.memory.extraInfo.task.type);
                console.log(`reduce the transmission amount`);
            }

            if (creep.memory.extraInfo.task.amount <= 0) {
                console.log(`${creep.room.name} abort mission due to unknown error`);
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
                return;
            }

            creep.memory.stage = 'withdraw';
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity() != 0) {
            creep.memory.stage = 'transfer';
            creep.memory.amount = creep.store.getUsedCapacity();
            return;
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity() == 0) {
            // don't do any mission when the creep is going to die
            if (creep.ticksToLive < 100) {
                creep.suicide();
                return;
            }

            let target = Game.getObjectById(creep.memory.extraInfo.task.from);

            let amount = Math.min(creep.store.getFreeCapacity(), creep.memory.extraInfo.task.amount);
            creep.say(amount);
            
            let ret = creep.withdraw(target, creep.memory.extraInfo.task.type, amount);
            if (ret == ERR_NOT_IN_RANGE) {
                // creep.moveTo(target);
                creep.goTo(target.pos, 1);
            } else if (ret == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
                return;
            } else if (ret == ERR_INVALID_ARGS){
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
            }
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity() == 0) {
            creep.memory.extraInfo.task.amount -= creep.memory.amount;
            if (creep.memory.extraInfo.task.amount == 0) {
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
                creep.say('complete');
            } else {
                creep.memory.stage = 'check';
                creep.say('continue');
            }
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity() != 0) {
            let target = Game.getObjectById(creep.memory.extraInfo.task.to);
            let ret = creep.transfer(target, creep.memory.extraInfo.task.type);
            if (ret == ERR_NOT_IN_RANGE) {
                // creep.moveTo(target);
                creep.goTo(target.pos, 1);
            } else if (ret == ERR_FULL) {
                console.log(`${creep.name} abort the mission due to the lack of space`);
                creep.memory.extraInfo.task = undefined;
                creep.memory.stage = 'wait';
            }
            return;
        }

    }
}

module.exports = manager;