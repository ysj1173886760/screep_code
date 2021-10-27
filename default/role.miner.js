module.exports = {
    run: function(creep) {
        if (creep.memory.mining && creep.store.getFreeCapacity() == 0) {
            creep.memory.mining = false;
        }

        if (!creep.memory.mining && creep.store.getUsedCapacity() == 0) {
            creep.memory.mining = true;
        }

        if (creep.memory.mining) {
            if (creep.memory.working_source == undefined) {
                let target = creep.room.find(FIND_MINERALS);
                if (target.length > 0) {
                    creep.memory.working_source = target[0].id;
                }
            }

            let source = Game.getObjectById(creep.memory.working_source);
            if (source && source.mineralAmount) {
                creep.exHarvest(source);
            } else {
                if (creep.memory.isNeeded) {
                    creep.memory.isNeed = false;
                    console.log('mineral is exhausted');
                    creep.suicide();
                }
            }
        } else {
            let target = creep.room.storage;
            if (target) {
                creep.exTransferAll(target);
            }
        }
    }
}