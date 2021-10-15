var {getStructureByFlag} = require('utils');

function linkWork(room)
{
    let flag = Game.flags[`link 0 ${room.name}`];
    let from = getStructureByFlag(flag, STRUCTURE_LINK);

    let target_flag = Game.flags[`link ${room.name}`];
    let target = getStructureByFlag(target_flag, STRUCTURE_LINK);
    if(!target)return;

    if(from && from.store.getUsedCapacity(RESOURCE_ENERGY) >= 400 && from.cooldown == 0)
    {
        //console.log(from.store.getUsedCapacity(RESOURCE_ENERGY));
        from.transferEnergy(target);
    }

    flag = Game.flags[`link 1 ${room.name}`];
    from = getStructureByFlag(flag, STRUCTURE_LINK);
    if(from && from.store.getUsedCapacity(RESOURCE_ENERGY) >= 400 && from.cooldown == 0)
    {
        //console.log(from.store.getUsedCapacity(RESOURCE_ENERGY));
        from.transferEnergy(target);
    }
}

module.exports = linkWork;