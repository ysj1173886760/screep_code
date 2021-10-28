var manager = {
    run: function(creep) {
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
                    creep.memory.stage = 'withdraw';
                    console.log(`${creep.name} mission acquired, transfer ${creep.memory.extraInfo.task.amount} ${creep.memory.extraInfo.task.type}`);
                }
            } else {
                creep.memory.stage = 'withdraw';
            }

            if (creep.memory.stage == 'wait') {
                creep.moveTo(room.storage);
            }
            return;
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
                creep.moveTo(target);
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
                creep.memory.stage = 'withdraw';
                creep.say('continue');
            }
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity() != 0) {
            let target = Game.getObjectById(creep.memory.extraInfo.task.to);
            if (creep.transfer(target, creep.memory.extraInfo.task.type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }

    }
}

module.exports = manager;