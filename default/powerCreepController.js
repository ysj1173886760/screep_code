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
        }
    }

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

module.exports = {
    powerCreepController
}