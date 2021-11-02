var ruin_transfer = {
    run: function(creep) {
        if (creep.memory.transfering && creep.store.getUsedCapacity() == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            let storage = creep.room.storage;
            if (storage) {
                creep.exTransferAll(storage);
            }
        } else {
            let target = Game.getObjectById(creep.memory.extraInfo.ruin);
            if (target) {
                if (target.store.getUsedCapacity() == 0) {
                    if (creep.memory.isNeeded) {
                        creep.memory.isNeeded = false;
                    }
                    return;
                }
                for (let resourceType in target.store) {
                    creep.exWithdraw(target, resourceType);
                }
            }
        }
    }
};

module.exports = ruin_transfer;