var {upgradeController} = require('utils');

var extender = {
    run: function(creep) {
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }

        if (creep.room.name != creep.memory.extraInfo.working_room) {
            if (creep.memory.extraInfo.path) {
                let pth = creep.memory.extraInfo.path;
                for (let i = 0; i < pth.length; i++) {
                    if (pth[i] == creep.room.name) {
                        let nxt = pth[i + 1];
                        creep.moveTo(new RoomPosition(25, 25, nxt), {reusePath: 50});
                        return;
                    }
                }
            }

            creep.moveTo(new RoomPosition(25, 25, creep.memory.extraInfo.working_room), {reusePath: 50});
            return;
        }

        
        if (creep.memory.harvesting) {
            if (creep.memory.working_source == undefined) {
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

                // if (!creep.pos.isEqualTo(flag.pos)) {
                //     creep.moveTo(flag);
                //     return;
                // }

                let target = flag.pos.findClosestByPath(FIND_SOURCES);
                creep.memory.working_source = target.id;
            }

            let resource = Game.getObjectById(creep.memory.working_source);
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }

        } else {
            let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => {
                    return (s.structureType == STRUCTURE_SPAWN ||
                            s.structureType == STRUCTURE_EXTENSION) &&
                            s.store.getFreeCapacity() > 0;
                }
            });

            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: { stoke: '#ffffff'}});
                }
                return;
            }

            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }

            upgradeController(creep);
        }
    }
};

module.exports = extender;