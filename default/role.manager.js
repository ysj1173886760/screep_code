var manager = {
    callback: {
        labCallback: function(creep, args) {
            if (!args) {
                return;
            }

            let room = creep.room;
            if (!room.memory.labController) {
                return;
            }

            room.memory.labController.missionControl[args.id] = false;
            console.log(`doing lab callback ${args.id}`);
        },
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
        if (creep.room.memory.manager_task == undefined) {
            creep.memory.stage = 'wait';
            if (creep.store.getUsedCapacity() != 0) {
                creep.exTransferAll(creep.room.storage);
                creep.say('transfer');
                return;
            }
        }
        if (!creep.room.storage) {
            return;
        }

        creep.memory.crossLevel = 11;
        if (creep.memory.stage == undefined || creep.memory.stage == 'wait') {
            let room = Game.rooms[creep.memory.roomname];
            if (room.memory.task_queue == undefined) {
                room.memory.task_queue = new Array();
            }

            if (creep.ticksToLive < 20) {
                creep.say('killing myself');
                creep.suicide();
                return;
            }

            if (creep.room.memory.manager_task == undefined) {
                if (room.memory.task_queue.length > 0) {
                    creep.room.memory.manager_task = room.memory.task_queue[0];
                    room.memory.task_queue.shift();
                    creep.memory.stage = 'check';
                    console.log(`${creep.name} mission acquired, transfer ${creep.room.memory.manager_task.amount} ${creep.room.memory.manager_task.type}`);
                    let from = Game.getObjectById(creep.room.memory.manager_task.from);
                    if (from) {
                        creep.goTo(from.pos, 1);
                    }
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
            let from = Game.getObjectById(creep.room.memory.manager_task.from);
            let to = Game.getObjectById(creep.room.memory.manager_task.to);
            if (!from || !to) {
                console.log(`${creep.room.name} abort mission due to invalid target`);
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
                return;
            }
            if (from.store[creep.room.memory.manager_task.type] < creep.room.memory.manager_task.amount) {
                console.log(`${creep.room.name} abort mission due to lack of source`);
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
                return;
            }

            if (to.store.getFreeCapacity(creep.room.memory.manager_task.type) == 0) {
                console.log(`${creep.room.name} abort mission due to not enough space`);
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
                return;
            }

            if (to.store.getFreeCapacity(creep.room.memory.manager_task.type) < creep.room.memory.manager_task.amount) {
                creep.room.memory.manager_task.amount = to.store.getFreeCapacity(creep.room.memory.manager_task.type);
                console.log(`reduce the transmission amount`);
            }

            if (creep.room.memory.manager_task.amount <= 0) {
                console.log(`${creep.room.name} abort mission due to unknown error`);
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
                return;
            }

            creep.memory.stage = 'withdraw';
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity(creep.room.memory.manager_task.type) != 0) {
            creep.memory.stage = 'transfer';
            creep.memory.amount = creep.store.getUsedCapacity(creep.room.memory.manager_task.type);
            let target = Game.getObjectById(creep.room.memory.manager_task.to);
            if (target && !creep.pos.inRangeTo(target, 1)) {
                creep.goTo(target.pos, 1);
            }
        }

        if (creep.memory.stage == 'withdraw' && creep.store.getUsedCapacity(creep.room.memory.manager_task.type) == 0) {
            // don't do any mission when the creep is going to die
            if (creep.ticksToLive < 20) {
                creep.suicide();
                return;
            }

            let target = Game.getObjectById(creep.room.memory.manager_task.from);

            let amount = Math.min(creep.store.getFreeCapacity(), creep.room.memory.manager_task.amount);
            creep.say(amount);
            
            let ret = creep.withdraw(target, creep.room.memory.manager_task.type, amount);
            if (ret == ERR_NOT_IN_RANGE) {
                // creep.moveTo(target);
                creep.goTo(target.pos, 1);
            } else if (ret == ERR_NOT_ENOUGH_RESOURCES || ret == ERR_INVALID_TARGET) {
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
            } else if (ret == ERR_INVALID_ARGS){
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
            } else if (ret == OK) {
                let target = Game.getObjectById(creep.room.memory.manager_task.to);
                if (target && !creep.pos.inRangeTo(target, 1)) {
                    creep.goTo(target.pos, 1);
                }
            } else if (ret == ERR_FULL) {
                creep.exTransferAll(creep.room.storage)
            }
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity(creep.room.memory.manager_task.type) == 0) {
            creep.room.memory.manager_task.amount -= creep.memory.amount;
            if (creep.room.memory.manager_task.amount == 0) {
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
                creep.say('complete');
            } else {
                creep.memory.stage = 'check';
                creep.say('continue');

                let target = Game.getObjectById(creep.room.memory.manager_task.from);
                if (target) {
                    if (creep.pos.inRangeTo(target, 1)) {
                        let amount = Math.min(creep.store.getFreeCapacity(), creep.room.memory.manager_task.amount);
                        let ret = creep.withdraw(target, creep.room.memory.manager_task.type, amount);
                        if (ret == OK) {
                            let to = Game.getObjectById(creep.room.memory.manager_task.to);
                            if (to) {
                                creep.goTo(to.pos, 1);
                            }
                        } else if (ret == ERR_NOT_ENOUGH_RESOURCES || ret == ERR_INVALID_ARGS || ret == ERR_INVALID_TARGET) {
                            creep.room.memory.manager_task = undefined;
                            creep.memory.stage = 'wait';
                        }
                    } else {
                        creep.goTo(target.pos, 1);
                    }
                }
                
            }
            return;
        }

        if (creep.memory.stage == 'transfer' && creep.store.getUsedCapacity(creep.room.memory.manager_task.type) != 0) {
            let target = Game.getObjectById(creep.room.memory.manager_task.to);
            let ret = creep.transfer(target, creep.room.memory.manager_task.type);
            if (ret == ERR_NOT_IN_RANGE) {
                // creep.moveTo(target);
                creep.goTo(target.pos, 1);
            } else if (ret == ERR_FULL) {
                console.log(`${creep.name} abort the mission due to the lack of space`);
                if (creep.room.memory.manager_task.callback != undefined) {
                    this.callback[creep.room.memory.manager_task.callback.name](creep, creep.room.memory.manager_task.callback.args);
                }
                creep.room.memory.manager_task = undefined;
                creep.memory.stage = 'wait';
            } else if (ret == OK) {
                let target = Game.getObjectById(creep.room.memory.manager_task.from);
                if (target) {
                    creep.goTo(target.pos, 1);
                }
            }
            return;
        }

    }
}

module.exports = manager;