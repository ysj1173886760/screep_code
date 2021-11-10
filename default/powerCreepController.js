/**
 * 
 * @param {Room} room 
 */
function powerCreepController(room) {
    if (room.controller.level < 8) {
        return;
    }

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
            return;
        }

        if ((!source.effects || !source.effects.find((e) => (e.effect == PWR_REGEN_SOURCE))) && 
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

    for (let id in room.memory.powerCreepController[PWR_OPERATE_LAB].labs) {
        let lab = Game.getObjectById(id);
        if (!lab) {
            return;
        }
        if (room.memory.labController.boostControl[id].enabled) {
            return;
        }

        if ((!lab.effects || !lab.effects.find((e) => (e.effect == PWR_OPERATE_LAB))) && 
            room.memory.powerCreepController[PWR_OPERATE_LAB].labs[id].missionSended == false) {
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

module.exports = {
    powerCreepController
}