var rebuilder = {
    // @ts-ignore
    run: function(creep) {
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }

        if (creep.memory.working) {
            let target = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType == STRUCTURE_SPAWN || 
                        s.structureType == STRUCTURE_EXTENSION ||
                        s.structureType == STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
                }
            });

            if (target.length > 0) {
                if (creep.transfer(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            }

            // try to upgrade controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            let target = Game.getObjectById(creep.memory.extraInfo.storage);
            if (target && target.store[RESOURCE_ENERGY] > 0) {
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                return;
            } else {
                creep.memory.isNeeded = false;
            }

            if (creep.memory.working_source == undefined) {
                if (creep.memory.extraInfo.working_location == undefined) {
                    creep.suicide();
                    return;
                }
                let flag = Game.flags[`container ${creep.memory.extraInfo.working_location} ${creep.room.name}`];

                let target = flag.pos.findClosestByPath(FIND_SOURCES);
                if (target) {
                    creep.memory.working_source = target.id;
                }
            }

            let resource = Game.getObjectById(creep.memory.working_source);
            if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(resource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = rebuilder;