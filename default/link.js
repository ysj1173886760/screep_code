var {getStructureByFlag} = require('utils');

/**
 * 
 * @param {Room} room 
 */
function linkWork(room) {
    let target_flag = Game.flags[`target_link ${room.name}`];
    let flag1 = Game.flags[`link 0 ${room.name}`];
    let flag2 = Game.flags[`link 1 ${room.name}`];

    let target = getStructureByFlag(target_flag, STRUCTURE_LINK);
    let from1 = getStructureByFlag(flag1, STRUCTURE_LINK);
    let from2 = getStructureByFlag(flag2, STRUCTURE_LINK);

    if (target) {
        if (from1 && from1.cooldown == 0 && from1.store[RESOURCE_ENERGY] >= 400) {
            from1.transferEnergy(target);
        }

        if (from2 && from2.cooldown == 0 && from2.store[RESOURCE_ENERGY] >= 400) {
            from2.transferEnergy(target);
        }
    }
}

module.exports = {
    linkWork
}