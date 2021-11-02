var power_retriever = {
    run: function(creep) {
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }

        if (!creep.memory.transfer && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfer = true;
        }

        if (creep.memory.transfer && creep.store.getUsedCapacity() == 0) {
            creep.memory.transfer = false;
        }

        if (creep.memory.transfer) {
            if (creep.room.name != creep.memory.roomname) {
                creep.goTo(new RoomPosition(25, 25, creep.memory.roomname), 20);
                return;
            }

            creep.exTransferAll(creep.room.storage);
        } else {
            let flag = Game.flags[`power ${creep.memory.extraInfo.squad.id} ${creep.room.name}`];
            if (!flag) {
                return;
            }
            if (creep.room.name != flag.pos.roomName) {
                creep.goTo(new RoomPosition(25, 25, flag.pos.roomName), 20);
                return;
            }

            if (!creep.pos.inRangeTo(flag, 5)) {
                creep.goTo(flag.pos, 5);
                return;
            }

            let target = creep.room.find(FIND_RUINS, {
                filter: (r) => {
                    return r.store[RESOURCE_POWER] > 0;
                }
            });
            if (target.length) {
                creep.exWithdraw(target[0], RESOURCE_POWER);
                return;
            }

            let target = creep.room.find(FIND_DROPPED_RESOURCES);
            if (target.length > 0) {
                creep.exPickup(target[0]);
                return;
            } else {
                creep.memory.transfer = true;
            }
        }
    }
};

module.exports = power_retriever;