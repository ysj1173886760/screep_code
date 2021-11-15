var power_creep = {
    costTable: {
        [PWR_GENERATE_OPS]: 0,
        [PWR_OPERATE_SPAWN]: 100,
        [PWR_OPERATE_TOWER]: 10,
        [PWR_OPERATE_STORAGE]: 100,
        [PWR_OPERATE_LAB]: 10,
        [PWR_OPERATE_EXTENSION]: 2,
        [PWR_OPERATE_OBSERVER]: 10,
        [PWR_OPERATE_TERMINAL]: 100,
        [PWR_DISRUPT_SPAWN]: 10,
        [PWR_DISRUPT_TOWER]: 10,
        [PWR_DISRUPT_SOURCE]: 100,
        [PWR_REGEN_SOURCE]: 0,
        [PWR_REGEN_MINERAL]: 0,
        [PWR_OPERATE_POWER]: 200,
        [PWR_OPERATE_CONTROLLER]: 200,
        [PWR_OPERATE_FACTORY]: 100,
    },
    callback: {
        [PWR_REGEN_SOURCE]: function(room, args) {
            room.memory.powerCreepController[PWR_REGEN_SOURCE].sources[args.id].missionSended = false;
            console.log(`doing power creep regen source callback ${args.id}`);
        },
        [PWR_OPERATE_LAB]: function(room, args) {
            room.memory.powerCreepController[PWR_OPERATE_LAB].labs[args.id].missionSended = false;
            console.log(`doing power creep operate lab callback ${args.id}`);
        },
        [PWR_OPERATE_POWER]: function(room, args) {
            room.memory.powerCreepController[PWR_OPERATE_POWER].powerSpawns[args.id].missionSended = false;
            console.log(`doing power creep operate power callback ${args.id}`);
        }
    },
    /**
     * 
     * @param {PowerCreep} creep 
     */
    run: function(creep) {
        if (!creep.ticksToLive) {
            return;
        }

        if (!creep.memory.spawn) {
            let pws = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    return s.structureType == STRUCTURE_POWER_SPAWN;
                }
            });
            if (pws.length) {
                creep.memory.spawn = pws[0].id;
            }
        }

        if (creep.ticksToLive < 200) {
            let spawn = Game.getObjectById(creep.memory.spawn);
            if (spawn) {
                if (!creep.pos.inRangeTo(spawn, 1)) {
                    creep.goTo(spawn.pos, 1);
                } else {
                    creep.renew(spawn);
                }
                return;
            }
        }

        if (!creep.room.controller.isPowerEnabled) {
            if (creep.pos.inRangeTo(creep.room.controller, 1)) {
                creep.enableRoom(creep.room.controller);
            } else {
                creep.goTo(creep.room.controller.pos, 1);
            }
            return;
        }

        if (creep.powers[PWR_GENERATE_OPS] && 
            creep.powers[PWR_GENERATE_OPS].cooldown == 0 && 
            creep.store.getFreeCapacity(RESOURCE_OPS) != 0) {
            creep.usePower(PWR_GENERATE_OPS);
            return;
        }

        if (creep.memory.stage == undefined || creep.memory.stage == 'wait') {
            creep.memory.stage = 'wait';
            if (creep.store.getFreeCapacity(RESOURCE_OPS) == 0) {
                creep.exTransfer(creep.room.storage, RESOURCE_OPS);
            }

            if (!creep.room.memory.powerCreepController || creep.room.memory.powerCreepController.enabled == false) {
                return;
            }

            for (let power_id in creep.powers) {
                let power = creep.powers[power_id];
                if (power.cooldown > 0) {
                    continue;
                }

                if (creep.room.memory.powerCreepController[power_id] == undefined) {
                    continue;
                }

                if (creep.room.memory.powerCreepController[power_id].tasks && 
                    creep.room.memory.powerCreepController[power_id].tasks.length > 0) {
                    creep.memory.task = creep.room.memory.powerCreepController[power_id].tasks[0];
                    let cost = this.costTable[creep.memory.task.type];
                    if (creep.store[RESOURCE_OPS] < cost && creep.room.storage.store[RESOURCE_OPS] < cost) {
                        creep.memory.task = undefined;
                        continue;
                    }
                    creep.room.memory.powerCreepController[power_id].tasks.shift();
                    creep.memory.stage = 'work';
                    console.log(`POWERCREEP: accept mission, using ${creep.memory.task.type} to ${creep.memory.task.target}`);
                    break;
                }
            }
        }

        if (creep.memory.stage == 'work') {
            let cost = this.costTable[creep.memory.task.type];
            if (creep.store[RESOURCE_OPS] < cost) {
                creep.exWithdraw(creep.room.storage, RESOURCE_OPS);
                return;
            }

            let target = Game.getObjectById(creep.memory.task.target);
            if (target) {
                if (creep.pos.inRangeTo(target, 3)) {
                    let ret = creep.usePower(creep.memory.task.type, target);
                    if (ret == OK) {
                        if (creep.memory.task.callback) {
                            this.callback[creep.memory.task.type](creep.room, creep.memory.task.callback.args);
                        }
                        creep.memory.task = undefined;
                        creep.memory.stage = 'wait';
                    } else {
                        console.log(`failed to operate ${ret}`);
                    }
                } else {
                    creep.goTo(target.pos, 3);
                }
            }
        }
    }
};

module.exports = power_creep;