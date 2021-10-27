const { transform } = require('lodash');
var {getStructureByFlag} = require('utils');

module.exports = {
    run: function(creep) {
        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfer = false;
        }

        if (!creep.memory.transfer && creep.store.getUsedCapacity() != 0) {
            creep.memory.transfer = true;
        }

        // initialize part
        let flag = Game.flags[`center ${creep.room.name}`];
        if (!creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag);
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
            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            creep.memory.transferLink = false;
            return;
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

            if (creep.memory.extraInfo.task == undefined) {
                if (room.memory.center_task_queue.length > 0) {
                    creep.memory.extraInfo.task = room.memory.center_task_queue[0];
                    room.memory.center_task_queue.shift();
                    creep.memory.stage = 'withdraw';
                    console.log(`mission acquired, transfer ${creep.memory.extraInfo.task.amount} ${creep.memory.extraInfo.task.type}`);
                }
            } else {
                creep.memory.stage = 'withdraw';
            }
            return;
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity() != 0) {
            creep.memory.stage = 'transfer';
            creep.memory.amount = creep.store.getUsedCapacity();
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity() == 0) {
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