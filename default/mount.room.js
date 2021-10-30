module.exports = function() {
    _.assign(Room.prototype, roomExtension);
}

const roomExtension = {
    addRestrictedPos(creepName, pos) {
        if (!this.memory.restrictedPos) {
            this.memory.restrictedPos = {};
        }

        this.memory.restrictedPos[creepName] = this.serializePos(pos);
    },

    getRestrictedPos() {
        return this.memory.restrictedPos;
    },

    unserializePos(pos) {
        const infos = posStr.split('/');
        return infos.length === 3 ? new RoomPosition(Number(infos[0]), Number(infos[1]), infos[2]) : undefined;
    }
}