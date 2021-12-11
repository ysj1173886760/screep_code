var deposit_harvester = {
    run: function(creep) {
        // G_roomSpawn('deposit_harvester', 'E45S59', true, 100, {needBoost: true, boostResource: ['UHO2']})
        if (creep.spawning) {
            return;
        }

        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }

        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting && creep.store.getUsedCapacity() == 0) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.startTime == undefined) {
            creep.memory.startTime = Game.time;
        }

        if (creep.memory.time && creep.ticksToLive < creep.memory.time + 30) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                creep.goTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), 20);
                return;
            }
            
            let source = Game.getObjectById(creep.memory.extraInfo.working_deposit);
            if (source) {
                if (source.lastCooldown > 200) {
                    if (creep.memory.isNeeded) {
                        creep.memory.isNeeded = false;
                    }

                    if (Memory.deposit_harvesters[creep.memory.extraInfo.working_deposit] != undefined) {
                        Memory.deposit_harvesters[creep.memory.extraInfo.working_deposit] = undefined;
                    }

                } else if (source.lastCooldown > 50) {
                    if (creep.memory.extraInfo.needBoost) {
                        creep.memory.extraInfo.needBoost = false;
                    }
                }
                if (creep.pos.inRangeTo(source, 1)) {
                    if (creep.memory.time == undefined) {
                        creep.memory.time = Game.time - creep.memory.startTime;
                    }
                    creep.exHarvest(source);
                } else {
                    creep.goTo(source.pos, 1);
                }
            }
        } else {
            if (creep.room.name != creep.memory.roomname) {
                creep.goTo(new RoomPosition(25, 25, creep.memory.roomname), 20);
                return;
            }

            creep.exTransferAll(creep.room.storage);
        }
    }
}

module.exports = deposit_harvester;