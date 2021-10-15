function getStructureByFlag(flag, STRUCTURE_TYPE) {
    if(!flag)return;
    let target = flag.room.lookForAt(LOOK_STRUCTURES, flag.pos.x, flag.pos.y);
    return target.find(s => s.structureType == STRUCTURE_TYPE);
}

module.exports = {
    getStructureByFlag
}