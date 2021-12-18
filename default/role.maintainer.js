var {
    getStructureByFlag
} = require('utils');

var maintainer = {
    getNextTargetAhead(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_TOWER) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 300 &&
                        s.id != creep.memory.target;

            }
        });
        if (target) {
            return target.id;
        }
        
        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0 &&
                        s.id != creep.memory.target;

            }
        });
        if (target) {
            return target.id;
        }

        return null;
    },
    getNextTarget(creep) {
        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_TOWER) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 300;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }

        target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => {
                return (s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_SPAWN) && 
                        s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;

            }
        });
        if (target) {
            creep.memory.target = target.id;
            return;
        }

        creep.memory.target = undefined;
    },
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

    run_lab: function(creep) {
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
            if (creep.store.getUsedCapacity() != 0) {
                creep.exTransferAll(creep.room.storage);
                return;
            }

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

    },

    run_energy(creep) {
        if (creep.memory.transfering && creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.target = null;
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            if (creep.memory.target) {
                let tmp = Game.getObjectById(creep.memory.target)
                if (tmp && tmp.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    this.getNextTarget(creep);
                }
            } else {
                this.getNextTarget(creep);
            }

            if (creep.memory.target == undefined && creep.store.getFreeCapacity() != 0) {
                creep.memory.transfering = false;
                return;
            }

            let target = Game.getObjectById(creep.memory.target);
            
            if (target) {
                let ret = creep.transfer(target, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.memory.crossLevel = 12;
                    creep.goTo(target.pos, 1);
                    // creep.moveTo(target);
                } else if (ret == OK) {
                    let nxt = Game.getObjectById(this.getNextTargetAhead(creep));
                    if (nxt && nxt.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        creep.memory.crossLevel = 12;
                        creep.goTo(nxt.pos, 1);
                        creep.memory.target = nxt.id;
                    } else {
                        creep.memory.target = null;
                    }
                }
                return;
            }

            // target = creep.room.find(FIND_STRUCTURES, {
            //     filter: (s) => {
            //         return s.structureType == STRUCTURE_NUKER &&
            //                 s.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            //     }
            // });
            // if (target.length) {
            //     creep.exTransfer(target[0], RESOURCE_ENERGY);
            //     return;
            // }
            creep.memory.crossLevel = 10;
            creep.room.memory.energyTransferMission = false;
            console.log(`${creep.name} finish energy transfer mission`);

        } else {
            let target = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            if (target.length > 0) {
                creep.exPickupCache(target[0], 10);
                return;
            }
            
            if (creep.store[RESOURCE_ENERGY] == 0 && creep.store.getUsedCapacity() != 0) {
                creep.exTransferAll(creep.room.storage);
                return;
            }

            if (creep.room.storage) {
                creep.exWithdraw(creep.room.storage, RESOURCE_ENERGY);
                creep.memory.target = null;
            }

        }
    },

    run: function(creep) {
        if (creep.room.memory.energyTransferMission) {
            if (creep.room.memory.manager_task && creep.store[creep.room.memory.manager_task.type] != 0) {
                this.run_lab(creep);
            } else {
                this.run_energy(creep);
            }
        } else {
            this.run_lab(creep);
        }
    }
};

module.exports = maintainer;