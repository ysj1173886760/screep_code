var manager = {
    run: function(creep) {
        if (creep.memory.stage == undefined || creep.memory.stage == 'wait') {
            let room = Game.rooms[creep.memory.roomname];
            if (room.memory.task_queue == undefined) {
                room.memory.task_queue = new Array();
            }

            if (room.memory.task_queue.length > 0) {
                creep.memory.extraInfo.task = room.memory.task_queue[0];
                room.memory.task_queue.shift();
                creep.memory.stage = 'withdraw';
                console.log(`mission acquired, transfer ${creep.memory.extraInfo.task.amount} ${creep.memory.extraInfo.task.type}`);
            }
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity() > 0) {
            creep.memory.stage = 'transfer';
            creep.memory.amount = creep.store.getUsedCapacity();
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity() == 0) {
            let target = Game.getObjectById(creep.memory.extraInfo.task.from);

            let amount = Math.min(creep.store.getFreeCapacity(), creep.memory.extraInfo.task.amount);
            creep.say(amount);
            if (creep.withdraw(target, creep.memory.extraInfo.task.type, amount) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
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
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity() != 0) {
            let target = Game.getObjectById(creep.memory.extraInfo.task.to);
            if (creep.transfer(target, creep.memory.extraInfo.task.type) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

    }
}

module.exports = manager;