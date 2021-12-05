var roleThief = {
    run: function(creep) {
        if (creep.memory.transfering && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.transfering = false;
        }

        if (!creep.memory.transfering && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfering = true;
        }


        if (creep.memory.transfering) {
            if (creep.room.name != creep.memory.roomname) {
                creep.moveBackHomeRoom();
                return;
            }

            creep.exTransferAll(creep.room.storage)
        } else {
            if (creep.room.name != creep.memory.extraInfo.working_room) {
                creep.moveToWorkingRoom();
                return;
            }

            let target = Game.getObjectById(creep.memory.extraInfo.target)
            if (target.store[RESOURCE_ENERGY] == 0) {
                creep.memory.isNeeded = false;
                creep.memory.transfering = true;
            }
            creep.exWithdraw(target, RESOURCE_ENERGY)
        }
    }
}

module.exports = roleThief;