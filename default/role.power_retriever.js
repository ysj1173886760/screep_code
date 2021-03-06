var power_retriever = {
    run: function(creep) {
        if (!creep.memory.boosted && creep.memory.extraInfo.needBoost) {
            creep.boostMe();
            return;
        }
        creep.memory.crossLevel = 13;
        creep.memory.standed = true;

        if (!creep.memory.transfer && creep.store.getFreeCapacity() == 0) {
            creep.memory.transfered = true;
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

            if (creep.pos.inRangeTo(creep.room.storage, 1)) {
                let ret = creep.transfer(creep.room.storage, RESOURCE_POWER);
                if (ret == OK) {
                    creep.memory.transfered = true;
                }
            } else {
                creep.goTo(creep.room.storage.pos, 1);
            }
        } else {
            if (creep.memory.transfered) {
                creep.suicide();
                return;
            }

            let flag = Game.flags[`${creep.memory.extraInfo.powerbank}`];
            if (!flag) {
                return;
            }
            if (creep.room.name != flag.pos.roomName) {
                creep.goTo(new RoomPosition(25, 25, flag.pos.roomName));
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

            target = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (r) => {
                    return r.resourceType == RESOURCE_POWER;
                }
            });
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