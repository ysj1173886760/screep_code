const { getOppositeDirection } = require("./utils");

module.exports = function() {
    _.assign(Creep.prototype, creepExtension);
    _.assign(PowerCreep.prototype, creepExtension);
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
        if (!this.pos.inRangeTo(target, 3)) {
            this.goTo(target.pos, 2);
            return;
        }

        if (this.upgradeController(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 2);
        }
    },

    exHarvest(resource) {
        if (!this.pos.inRangeTo(resource, 1)) {
            this.goTo(resource.pos, 1);
            return;
        }

        if (this.harvest(resource) == ERR_NOT_IN_RANGE) {
            // this.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(resource.pos, 1);
        }
    },

    exHarvestCache(resource, reusePath) {
        if (!this.pos.inRangeTo(resource, 1)) {
            this.goTo(resource.pos, 1);
            return;
        }

        if (this.harvest(resource) == ERR_NOT_IN_RANGE) {
            // this.moveTo(resource, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(resource.pos, 1);
        }
    },

    exTransfer(target, type) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.transfer(target, type) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 1);
        }
    },

    exTransferCache(target, type, reusePath) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.transfer(target, type) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(target.pos, 1);
        }
    },

    exTransferAll(target) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        for (let resourceType in this.store) {
            if (this.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                this.goTo(target.pos, 1);
                break;
            }
        }
    },

    exPickup(target) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.pickup(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 1);
        }
    },

    exPickupCache(target, reusePath) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.pickup(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(target.pos, 1);
        }
    },

    exWithdraw(target, type) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.withdraw(target, type) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 1);
        }
    },

    exWithdrawCache(target, type, reusePath) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.withdraw(target, type) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(target.pos, 1);
        }
    },

    exBuild(target) {
        if (!this.pos.inRangeTo(target, 3)) {
            this.goTo(target.pos, 3);
            return;
        }

        if (this.build(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 3);
        }
    },

    exBuildCache(target, reusePath) {
        if (!this.pos.inRangeTo(target, 3)) {
            this.goTo(target.pos, 3);
            return;
        }

        if (this.build(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(target.pos, 3);
        }
    },

    exClaimController(target) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.claimController(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 1);
        }
    },

    exReserveController(target) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.reserveController(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 1);
        }
    },

    exReserveControllerCache(target, reusePath) {
        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (this.reserveController(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(target.pos, 1);
        }
    },

    moveToWorkingRoom() {
        if (this.memory.nextRoom && this.room.name != this.memory.nextRoom) {
            // this.moveTo(new RoomPosition(25, 25, this.memory.nextRoom), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 15});
            this.goTo(new RoomPosition(25, 25, this.memory.nextRoom), 20);
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

    moveToWorkingRoomCache(reusePath) {
        if (this.memory.nextRoom && this.room.name != this.memory.nextRoom) {
            // this.moveTo(new RoomPosition(25, 25, this.memory.nextRoom), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
            this.goTo(new RoomPosition(25, 25, this.memory.nextRoom), 20);
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
            // this.moveTo(new RoomPosition(25, 25, this.memory.nextRoom), {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 15});
            this.goTo(new RoomPosition(25, 25, this.memory.nextRoom), 20);
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
        if (!this.pos.inRangeTo(target, 3)) {
            this.goTo(target.pos, 3);
            return;
        }

        if (this.repair(target) == ERR_NOT_IN_RANGE) {
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            this.goTo(target.pos, 3);
        }
    },

    exRepairCache(target, reusePath) {
        if (!this.pos.inRangeTo(target, 3)) {
            this.goTo(target.pos, 3);
            return;
        }

        if (this.repair(target) == ERR_NOT_IN_RANGE) {
            this.goTo(target.pos, 3);
            // this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: reusePath});
        }
    },

    renewMe() {
        if (this.memory.renewSpawn == undefined) {
            let spawn = this.room.find(FIND_MY_SPAWNS, {
                filter: (s) => {
                    return !s.spawning;
                }
            });
            if (spawn.length == 0) {
                return;
            }

            this.memory.renewSpawn = spawn[0].id;
        }

        let target = Game.getObjectById(this.memory.renewSpawn);
        if (!target) {
            return;
        }

        if (!this.pos.inRangeTo(target, 1)) {
            this.goTo(target.pos, 1);
            return;
        }

        if (!target.spawning) {
            let ret = target.renewCreep(this);
            if (ret == OK) {
                console.log(`renewing ${this.name}`);
            } else {
                console.log(`${ret} failed to renew`);
            }
        } else {
            let spawn = this.room.find(FIND_MY_SPAWNS, {
                filter: (s) => {
                    return !s.spawning;
                }
            });
            if (spawn.length == 0) {
                return;
            }
            this.memory.renewSpawn = spawn[0].id;
        }
    },

    /**
     * 
     * @param {RoomPosition} pos 
     */
    standardizePos(pos) {
        return `${pos.roomName}/${pos.x}/${pos.y}/${Game.shard.name}`;
    },

    getStandedPos() {
        var standedCreep = this.room.find(FIND_MY_CREEPS, {
            filter: (c) => {
                return (c.memory.standed == true) ||
                        (c.memory.crossLevel && this.memory.crossLevel && c.memory.crossLevel > this.memory.crossLevel);
            }
        });

        if (standedCreep.length > 0) {
            var posList = [];
            for (var i of standedCreep) {
                posList.push(i.pos);
            }
            return posList;
        }
        return [];
    },

    /**
     * 
     * @param {RoomPosition} target 
     * @param {number} range 
     */
    findPath(target, range) {
        if (!global.routeCache) {
            global.routeCache = {};
        }

        if (!this.memory.moveData) {
            this.memory.moveData = {};
        }

        this.memory.moveData.index = 0;
        const routeKey = `${this.standardizePos(this.pos)} ${this.standardizePos(target)}`;
        var route = global.routeCache[routeKey];
        if (route && this.room.name != target.roomName) {
            return route;
        }

        const result = PathFinder.search(this.pos, {pos: target, range: range}, {
            plainCost: 2,
            swampCost: 10,
            maxOps: 6000,
            roomCallback: roomName => {
                // bypass room
                if (Memory.bypassRooms && Memory.bypassRooms.includes(roomName)) {
                    return false;
                }

                // creep only bypass
                if (this.memory.bypassRooms && this.memory.bypassRooms.includes(roomName)) {
                    return false;
                }

                const room = Game.rooms[roomName];

                if (!room) {
                    return;
                }

                let costs = new PathFinder.CostMatrix;
                room.find(FIND_STRUCTURES).forEach(
                    s => {
                        if (s.structureType == STRUCTURE_ROAD) {
                            costs.set(s.pos.x, s.pos.y, 1);
                        } else if (s.structureType !== STRUCTURE_CONTAINER && 
                                    (s.structureType !== STRUCTURE_RAMPART || !s.my)) {
                            costs.set(s.pos.x, s.pos.y, 0xff);
                        }
                    }
                );
                room.find(FIND_MY_CONSTRUCTION_SITES).forEach(
                    cons => {
                        if (cons.structureType != STRUCTURE_ROAD && 
                            cons.structureType != STRUCTURE_RAMPART &&
                            cons.structureType != STRUCTURE_CONTAINER) {
                            costs.set(cons.pos.x, cons.pos.y, 0xff);
                        }
                    }
                );
                room.find(FIND_HOSTILE_CREEPS).forEach(
                    c => {
                        costs.set(c.pos.x, c.pos.y, 255);
                    }
                );

                const restrictedPos = this.getStandedPos();
                for (const pos of restrictedPos) {
                    costs.set(pos.x, pos.y, 0xff);
                }
                return costs;
            }
        });

        if (result.path.length <= 0) {
            return null;
        }

        route = this.serializeFarPath(result.path);
        if (!result.incomplete) {
            global.routeCache[routeKey] = route;
        }
        return route;
    },

    
    /**
     * 
     * @param {RoomPosition[]} path 
     */
    serializeFarPath(path) {
        if (path.length == 0) {
            return '';
        }

        if (!path[0].isEqualTo(this.pos)) {
            path.splice(0, 0, this.pos);
        }

        return path.map((pos, index) => {
            if (index >= path.length - 1) {
                return null;
            }

            if (pos.roomName != path[index + 1].roomName) {
                return null;
            }

            return pos.getDirectionTo(path[index + 1]);
        }).join('');
    },

    goByPath() {
        if (!this.memory.moveData) {
            return ERR_NO_PATH;
        }

        const index =  this.memory.moveData.index;
        if (index >= this.memory.moveData.path.length) {
            delete this.memory.moveData.path;
            return OK;
        }

        const direction = Number(this.memory.moveData.path[index]);
        const goResult = this.go(direction);
        if (goResult == OK) {
            this.memory.moveData.index++;
        }
        return goResult;
    },

    /**
     * 
     * @param {RoomPosition} target 
     * @param {Number} range 
     */
    goTo(target, range = 1) {
        if (this.memory.moveData == undefined) {
            this.memory.moveData = {};
        }

        const targetPosTag = this.standardizePos(target);
        if (targetPosTag !== this.memory.moveData.targetPos) {
            this.memory.moveData.targetPos = targetPosTag;
            this.memory.moveData.path = this.findPath(target, range);
        }

        if (!this.memory.moveData.path) {
            this.memory.moveData.path = this.findPath(target, range);
        }

        if (!this.memory.moveData.path) {
            delete this.memory.moveData.path;
            return OK;
        }

        const goResult = this.goByPath();
        if (goResult == ERR_INVALID_TARGET) {
            delete this.memory.moveData;
        } else if (goResult != OK && goResult != ERR_TIRED) {
            this.say(`error ${goResult}`);
        }

        return goResult;
    },

    /**
     * 
     * @param {DirectionConstant} direction 
     */
    requestCross(direction) {
        if (!this.memory.crossLevel) {
            this.memory.crossLevel = 10;
        }

        const frontPos = this.pos.directionToPos(direction);
        if (!frontPos) {
            return ERR_NOT_FOUND;
        }

        const frontCreep = (frontPos.lookFor(LOOK_CREEPS)[0] || frontPos.lookFor(LOOK_POWER_CREEPS)[0]);
        if (!frontCreep) {
            return ERR_NOT_FOUND;
        }

        if (frontCreep.owner.username != this.owner.username) {
            return;
        }

        this.say("👉");
        if (frontCreep.manageCross(getOppositeDirection(direction), this.memory.crossLevel)) {
            this.move(direction);
        }
        return OK;
    },

    /**
     * 
     * @param {DirectionConstant} direction 
     * @param {number} crossLevel 
     */
    manageCross(direction, crossLevel) {
        if (!this.memory.crossLevel) {
            this.memory.crossLevel = 10;
        }

        if (!this.memory) {
            return true;
        }

        if (this.memory.standed || this.memory.crossLevel > crossLevel) {
            return false;
        }

        this.say('👌');
        this.move(direction);
        return true;
    },

    /**
     * 
     * @param {DirectionConstant} direction 
     */
    go(direction) {
        const moveResult = this.move(direction);
        if (moveResult != OK) {
            return moveResult;
        }

        const currentPos = `${this.pos.x}/${this.pos.y}`;
        if (this.memory.prePos && currentPos == this.memory.prePos) {
            const crossResult = this.memory.disableCross ? ERR_BUSY : this.requestCross(direction);
            if (crossResult != OK) {
                delete this.memory.moveData;
                return ERR_INVALID_TARGET;
            }
        }
        this.memory.prePos = currentPos;
        return OK;
    },

    boostMe() {
        if (this.room.name != this.memory.roomname) {
            this.moveBackHomeRoom();
            return;
        }
        if ((this.memory.boostStage == 'init' || this.memory.boostStage == 'wait') && this.ticksToLive < 1450) {
            this.renewMe();
            return;
        }

        if (this.memory.boostStage == undefined) {
            let room = this.room;
            if (room.memory.boostController.enabled == false) {
                this.memory.boosted = true;
                return;
            }
            this.memory.boostStage = 'init';
            return;
        } 

        if (this.memory.boostStage == 'init') {
            let task = {
                boostResource: this.memory.extraInfo.boostResource,
                id: this.id,
            };
            let room = this.room
            
            room.memory.boostController.boostQueue.push(task);
            this.memory.boostStage = 'wait';
        }
        

        if (this.memory.boostStage == 'wait') {
            return;
        }

        if (this.memory.boostStage == 'prepared') {
            return;
        }

        if (this.memory.boostStage == 'failed') {
            this.memory.extraInfo.needBoost = false;
            this.memory.boosted = true;
        }

        if (this.memory.boostStage == 'ok') {
            this.memory.boosted = true;
        }
        return;
    }

}