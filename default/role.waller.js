var waller = {
    getNextTarget(creep) {
        let target = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_RAMPART &&
                        s.hits <= creep.memory.extraInfo.maxHits;
            }
        });
        if (target.length) {
            creep.memory.target = target[0].id;
            return;
        }

        target = creep.room.find(FIND_STRUCTURES, {
            filter: (s) => {
                return s.structureType == STRUCTURE_WALL &&
                        s.hits <= creep.memory.extraInfo.maxHits;
            }
        });
        if (target.length) {
            creep.memory.target = target[0].id;
            return;
        }
        creep.memory.target = undefined;
    },
    run: function(creep) {
        if (creep.memory.washing && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.washing = false;
        }

        if (!creep.memory.wash && creep.store.getFreeCapacity() == 0) {
            creep.memory.washing = true;
        }

        if (creep.memory.washing) {
            let target = creep.room.find(FIND_CONSTRUCTION_SITES, {
                filter: (c) => {
                    return c.structureType == STRUCTURE_WALL ||
                            c.structureType == STRUCTURE_RAMPART;
                }
            });
            if (target.length) {
                creep.exBuildCache(target[0], 10);
                // flush the cache
                creep.memory.target = undefined;
                return;
            }

            if (creep.memory.target != undefined) {
                let tmp = Game.getObjectById(creep.memory.target);
                if (tmp && tmp.hits >= creep.memory.extraInfo.maxHits) {
                    this.getNextTarget(creep);
                }
            } else {
                this.getNextTarget(creep);
            }

            target = Game.getObjectById(creep.memory.target);

            if (target) {
                creep.exRepair(target);
                return;
            } else {
                this.getNextTarget(creep);
                if (creep.memory.target == undefined) {
                    creep.memory.extraInfo.maxHits += 50000;
                }
            }
        } else {
            let storage = creep.room.storage;
            if (storage && storage.store[RESOURCE_ENERGY] >= 10000) {
                creep.exWithdraw(storage, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = waller;