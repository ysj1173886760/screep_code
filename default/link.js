var {getStructureByFlag} = require('utils');

/**
 * 
 * @param {Room} room 
 */
function linkWork(room) {
    let target_flag = Game.flags[`target_link ${room.name}`];
    let flag1 = Game.flags[`link 0 ${room.name}`];
    let flag2 = Game.flags[`link 1 ${room.name}`];
    let upgrade_link_flag = Game.flags[`upgrade_link ${room.name}`];

    let target = getStructureByFlag(target_flag, STRUCTURE_LINK);
    let from1 = getStructureByFlag(flag1, STRUCTURE_LINK);
    let from2 = getStructureByFlag(flag2, STRUCTURE_LINK);
    let upgrade_link = getStructureByFlag(upgrade_link_flag, STRUCTURE_LINK);
    let to_target = false;
    let to_upgrade = false;

    if (from1 && from1.cooldown == 0 && from1.store[RESOURCE_ENERGY] >= 800) {
        if (upgrade_link && upgrade_link.store[RESOURCE_ENERGY] == 0) {
            from1.transferEnergy(upgrade_link);
            to_upgrade = true;
        } else if (target && target.store[RESOURCE_ENERGY] == 0) {
            from1.transferEnergy(target);
            to_target = true;
        }
    }

    if (from2 && from2.cooldown == 0 && from2.store[RESOURCE_ENERGY] >= 800) {
        if (upgrade_link && upgrade_link.store[RESOURCE_ENERGY] == 0 && !to_upgrade) {
            from2.transferEnergy(upgrade_link);
            to_upgrade = true;
        } else if (target && target.store[RESOURCE_ENERGY] == 0 && !to_target) {
            from2.transferEnergy(target);
            to_target = true;
        }
    }

    // distant link
    for (let i = 2; i <= 3; i++) {
        let flag = Game.flags[`link ${i} ${room.name}`];
        if (!flag) {
            continue;
        }
        let link = getStructureByFlag(flag, STRUCTURE_LINK);
        if (!link) {
            continue;
        }

        if (link.cooldown == 0 && link.store[RESOURCE_ENERGY] >= 400) {
            if (target && target.store[RESOURCE_ENERGY] == 0 && !to_target) {
                link.transferEnergy(target);
                to_target = true;
            } else if (upgrade_link && upgrade_link.store[RESOURCE_ENERGY] == 0 && !to_upgrade) {
                link.transferEnergy(upgrade_link);
                to_upgrade = true;
            }
        }
    }
}

module.exports = {
    linkWork
}