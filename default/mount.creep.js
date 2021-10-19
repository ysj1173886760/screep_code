module.exports = function() {
    _.assign(Creep.prototype, creepExtension);
}

const creepExtension = {
    /**
     * 
     * @param {number} type 
     * @param {number} range 
     */
    findNearbyStuff(type, range) {
        let target = this.pos.findInRange(type, range);
        if (target.length > 0) {
            return target[0];
        }
        return null;
    },

    exUpgradeController() {
        let target = this.room.controller;
        if (this.upgradeController(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exHarvest(resource) {
        if (this.harvest(resource) == ERR_NOT_IN_RANGE) {
            this.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exTransfer(target, type) {
        if (this.transfer(target, type) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exTransferAll(target) {
        for (let resourceType in this.store) {
            if (this.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                break;
            }
        }
    },

    exPickup(target) {
        if (this.pickup(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exWithdraw(target, type) {
        if (this.withdraw(target, type) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exBuild(target) {
        if (this.build(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exClaimController(target) {
        if (this.claimController(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exReserveController(target) {
        if (this.reserveController(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    moveToWorkingRoom() {
        if (this.memory.extraInfo.path) {
            let pth = this.memory.extraInfo.path;
            for (let i = 0; i < pth.length; i++) {
                if (pth[i] == this.room.name) {
                    let nxt = pth[i + 1];
                    this.moveTo(new RoomPosition(25, 25, nxt), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
                    return;
                }
            }
        }

        this.moveTo(new RoomPosition(25, 25, this.memory.extraInfo.working_room), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
    },

    moveBackHomeRoom() {
        if (this.memory.extraInfo.path) {
            let pth = this.memory.extraInfo.path;
            for (let i = pth.length - 1; i >= 0; i--) {
                if (pth[i] == this.room.name) {
                    let nxt = pth[i - 1];
                    this.moveTo(new RoomPosition(25, 25, nxt), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
                    return;
                }
            }
        }

        this.moveTo(new RoomPosition(25, 25, this.memory.roomname), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
    },

    exRepair(target) {
        if (this.repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }

}