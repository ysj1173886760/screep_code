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

    exHarvestCache(resource, reusePath) {
        if (this.harvest(resource) == ERR_NOT_IN_RANGE) {
            this.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
        }
    },

    exTransfer(target, type) {
        if (this.transfer(target, type) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exTransferCache(target, type, reusePath) {
        if (this.transfer(target, type) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
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

    exPickupCache(target, reusePath) {
        if (this.pickup(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
        }
    },

    exWithdraw(target, type) {
        if (this.withdraw(target, type) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exWithdrawCache(target, type, reusePath) {
        if (this.withdraw(target, type) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
        }
    },

    exBuild(target) {
        if (this.build(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exBuildCache(target, reusePath) {
        if (this.build(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
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

    exReserveControllerCache(target, reusePath) {
        if (this.reserveController(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
        }
    },

    moveToWorkingRoom() {
        if (this.memory.nextRoom && this.room.name != this.memory.nextRoom) {
            this.moveTo(new RoomPosition(25, 25, this.memory.nextRoom), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
            return;
        }
        
        if (this.memory.extraInfo.path) {
            let pth = this.memory.extraInfo.path;
            for (let i = 0; i < pth.length; i++) {
                if (pth[i] == this.room.name) {
                    this.memory.nextRoom = pth[i + 1];
                    break;
                }
            }
        } else {
            this.memory.nextRoom = this.memory.extraInfo.working_room;
        }

        
    },

    moveBackHomeRoom() {
        if (this.memory.nextRoom && this.room.name != this.memory.nextRoom) {
            this.moveTo(new RoomPosition(25, 25, this.memory.nextRoom), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
            return;
        }
        
        if (this.memory.extraInfo.path) {
            let pth = this.memory.extraInfo.path;
            for (let i = pth.length - 1; i >= 0; i--) {
                if (pth[i] == this.room.name) {
                    this.memory.nextRoom = pth[i - 1];
                    break;
                }
            }
        } else {
            this.memory.nextRoom = this.memory.roomname;
        }

    },

    exRepair(target) {
        if (this.repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    },

    exRepairCache(target, reusePath) {
        if (this.repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
        }
    }

}