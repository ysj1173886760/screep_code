var deposit_harvester = {
    run: function(creep) {
        if (creep.memory.spawning) {
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


        if (creep.memory.time && creep.ticksToLive < creep.memory.time + 50) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            let flag = Game.flags['deposit'];
            if (!flag) {
                return;
            }
            if (creep.room.name != flag.pos.roomName) {
                creep.goTo(new RoomPosition(25, 25, flag.pos.roomName), 20);
                return;
            }
            
            if (creep.memory.working_source == undefined) {
                let target = creep.room.lookForAt(LOOK_DEPOSITS, flag.pos.x, flag.pos.y);
                if (target.length > 0) {
                    creep.memory.working_source = target[0].id;
                }
            }

            let source = Game.getObjectById(creep.memory.working_source);
            if (source) {
                if (source.lastCooldown > 50) {
                    if (creep.memory.isNeeded) {
                        creep.memory.isNeeded = false;
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