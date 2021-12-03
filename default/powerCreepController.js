/**
 * 
 * @param {Room} room 
 */
function powerCreepController(room) {
    if (room.memory.powerCreepController == undefined) {
        room.memory.powerCreepController = {
            enabled: false,
        }
    }

    if (!room.memory.powerCreepController.enabled) {
        return;
    }

    regenSource(room);
    operateLab(room);
    operatePowerSpawn(room);

}

function regenSource(room) {
    if (room.memory.powerCreepController[PWR_REGEN_SOURCE] == undefined) {
        let sources = room.find(FIND_SOURCES);
        
        let entrys = {};
        for (let source of sources) {
            entrys[source.id] = {
                missionSended: false
            }
        }
        room.memory.powerCreepController[PWR_REGEN_SOURCE] = {
            sources: entrys,
            tasks: [],
            countdown: Game.time
        }
    }

    if (!room.memory.powerCreepController[PWR_REGEN_SOURCE].countdown) {
        room.memory.powerCreepController[PWR_REGEN_SOURCE].countdown = Game.time;
    }
    if (Game.time - room.memory.powerCreepController[PWR_REGEN_SOURCE].countdown < 10) {
        return;
    }
    room.memory.powerCreepController[PWR_REGEN_SOURCE].countdown = Game.time;

    for (let id in room.memory.powerCreepController[PWR_REGEN_SOURCE].sources) {
        let source = Game.getObjectById(id);
        if (!source) {
            continue;
        }

        if ((!source.effects || !source.effects.find((e) => (e.effect == PWR_REGEN_SOURCE && e.ticksRemaining > 30))) && 
            room.memory.powerCreepController[PWR_REGEN_SOURCE].sources[id].missionSended == false) {
            // send mission
            room.memory.powerCreepController[PWR_REGEN_SOURCE].tasks.push({
                target: id,
                type: PWR_REGEN_SOURCE,
                callback: {
                    args: {
                        id: id
                    }
                }
            });
            room.memory.powerCreepController[PWR_REGEN_SOURCE].sources[id].missionSended = true;
        }
    }
}

function operateLab(room) {
    if (room.memory.powerCreepController[PWR_OPERATE_LAB] == undefined) {
        let labs = room.memory.labController.labs;

        let entrys = {}
        for (let lab of labs) {
            entrys[lab] = {
                missionSended: false
            }
        }
        room.memory.powerCreepController[PWR_OPERATE_LAB] = {
            labs: entrys,
            tasks: [],
            countdown: Game.time,
        }
    }

    if (Game.time - room.memory.powerCreepController[PWR_OPERATE_LAB].countdown < 10) {
        return;
    }
    room.memory.powerCreepController[PWR_OPERATE_LAB].countdown = Game.time;

    if (room.memory.labController.enabled == false) {
        return;
    }

    for (let id in room.memory.powerCreepController[PWR_OPERATE_LAB].labs) {
        let lab = Game.getObjectById(id);
        if (!lab) {
            continue;
        }
        if (room.memory.labController.boostControl[id].enabled) {
            continue;
        }

        if ((!lab.effects || !lab.effects.find((e) => (e.effect == PWR_OPERATE_LAB && e.ticksRemaining > 30))) && 
            room.memory.powerCreepController[PWR_OPERATE_LAB].labs[id].missionSended == false &&
            lab.cooldown != 0) {
            // send mission
            room.memory.powerCreepController[PWR_OPERATE_LAB].tasks.push({
                target: id,
                type: PWR_OPERATE_LAB,
                callback: {
                    args: {
                        id: id
                    }
                }
            });
            room.memory.powerCreepController[PWR_OPERATE_LAB].labs[id].missionSended = true;
        }
    }
}

function operatePowerSpawn(room) {
    if (room.memory.powerCreepController[PWR_OPERATE_POWER] == undefined) {
        let powerSpawn = room.find(FIND_MY_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_POWER_SPAWN;
            }
        });
        
        let entrys = {};
        if (powerSpawn.length) {
            entrys[powerSpawn[0].id] = {
                missionSended: false
            }
        }
        room.memory.powerCreepController[PWR_OPERATE_POWER] = {
            powerSpawns: entrys,
            tasks: [],
            countdown: Game.time
        }
    }

    if (!room.memory.powerCreepController[PWR_OPERATE_POWER].countdown) {
        room.memory.powerCreepController[PWR_OPERATE_POWER].countdown = Game.time;
    }
    if (Game.time - room.memory.powerCreepController[PWR_OPERATE_POWER].countdown < 10) {
        return;
    }
    room.memory.powerCreepController[PWR_OPERATE_POWER].countdown = Game.time;

    for (let id in room.memory.powerCreepController[PWR_OPERATE_POWER].powerSpawns) {
        let powerSpawn = Game.getObjectById(id);
        if (!powerSpawn) {
            continue;
        }

        if ((!powerSpawn.effects || !powerSpawn.effects.find((e) => (e.effect == PWR_OPERATE_POWER && e.ticksRemaining > 30))) && 
            room.memory.powerCreepController[PWR_OPERATE_POWER].powerSpawns[id].missionSended == false) {
            // send mission
            room.memory.powerCreepController[PWR_OPERATE_POWER].tasks.push({
                target: id,
                type: PWR_OPERATE_POWER,
                callback: {
                    args: {
                        id: id
                    }
                }
            });
            room.memory.powerCreepController[PWR_OPERATE_POWER].powerSpawns[id].missionSended = true;
        }
    }
}

module.exports = {
    powerCreepController
}