module.exports = {
    run: function(creep) {
        if (creep.memory.mining && creep.store.getFreeCapacity() == 0) {
            creep.memory.mining = false;
        }

        if (!creep.memory.mining && creep.store.getUsedCapacity() == 0) {
            creep.memory.mining = true;
        }

        creep.memory.standed = true;
        if (creep.memory.mining) {
            if (creep.memory.working_source == undefined) {
                let target = creep.room.find(FIND_MINERALS);
                if (target.length > 0) {
                    creep.memory.working_source = target[0].id;
                }
                
            }
            if (creep.memory.extractor == undefined) {
                let extractor = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => {
                        return s.structureType == STRUCTURE_EXTRACTOR;
                    }
                });
                if (extractor.length > 0) {
                    creep.memory.extractor = extractor[0].id;
                }
            }

            let source = Game.getObjectById(creep.memory.working_source);
            let extractor = Game.getObjectById(creep.memory.extractor);
            if (source && extractor && source.mineralAmount) {
                if (!creep.pos.isNearTo(source)) {
                    creep.goTo(source.pos, 1);
                } else if (extractor.cooldown == 0){
                    creep.harvest(source);
                }
            } else {
                if (creep.memory.isNeeded) {
                    creep.memory.isNeeded = false;
                    console.log('mineral is exhausted');
                    creep.suicide();
                    return;
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