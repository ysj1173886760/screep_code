var roleUpgrader = require('role.upgrader');
var {getStructureByFlag} = require('utils');

var roleBuilder = 
{

    run: function(creep)
    {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0)
        {
            creep.memory.building = false;
            creep.say('harvest');
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() == 0)
        {
            creep.memory.building = true;
            creep.say('build');
        }
        
        if(creep.memory.building)
        {
            if(creep.memory.targetRoom)
            {
                if(creep.room.name != creep.memory.targetRoom)
                {
                    let room = Game.rooms[creep.memory.targetRoom];
                    let exitDir = creep.room.findExitTo(room);
                    let exit = creep.pos.findClosestByPath(exitDir);
                    creep.moveTo(exit);
                    return;
                }
            }
            
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(target)
            {
                if(creep.build(target) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
            }
            else
            {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        else
        {
            //let target = Game.getObjectById('5eff4fa28e0c8c790e3e5441');
            //let target = Game.getObjectById('5f0fee01993f98666ec23c07');
            //let flag = Game.flags[`container ${creep.memory.work_location} ${creep.room.name}`];
            //let target = getStructureByFlag(flag, STRUCTURE_CONTAINER);
            
            let target = Game.getObjectById(creep.memory.storage);
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(target, {visualizePathStyle: {stoke: '#ffffff'}});
                }
                return;
            }
        }
    }
};

module.exports = roleBuilder;