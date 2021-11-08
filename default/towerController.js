var {whiteList} = require('whiteList');

function towerController(room) {
    if (room.memory.towerController == undefined) {
        room.memory.towerController = {
            countdown: Game.time,
        };
    }

    var towers = _.filter(Game.structures, (s) => (s.structureType == STRUCTURE_TOWER && s.room.name == room.name));
    if (!towers.length) {
        return;
    }

    if (room.memory.towerController.hostile) {
        let target = Game.getObjectById(room.memory.towerController.hostile);
        if (!target) {
            let hostile = room.find(FIND_HOSTILE_CREEPS, {
                filter: (c) => {
                    return whiteList.indexOf(c.owner.username) == -1;
                }
            });
            if (hostile.length) {
                room.memory.towerController.hostile = hostile[0].id;
                target = Game.getObjectById(room.memory.towerController.hostile);
            } else {
                room.memory.towerController.hostile = undefined;
            }
        }
    } else {
        let hostile = room.find(FIND_HOSTILE_CREEPS, {
            filter: (c) => {
                return whiteList.indexOf(c.owner.username) == -1;
            }
        });
        if (hostile.length) {
            room.memory.towerController.hostile = hostile[0].id;
            target = Game.getObjectById(room.memory.towerController.hostile);
        } else {
            room.memory.towerController.hostile = undefined;
        }
    }
    
    if (room.memory.towerController.hostile) {
        let target = Game.getObjectById(room.memory.towerController.hostile);
        if (target) {
            for (let tower of towers) {
                tower.attack(target);
            }
            return;
        }
    }


    if (room.memory.towerController.structure) {
        let target = Game.getObjectById(room.memory.towerController.structure);
        if (target && target.hits < target.hitsMax - 1500) {
            towers[0].repair(target);
            return;
        } else {
            room.memory.towerController.structure = undefined;
        }
    }

    if (Game.time - room.memory.towerController < 10) {
        return;
    }
    room.memory.towerController.countdown = Game.time;

    let structure = room.find(FIND_STRUCTURES, {
        filter:(s) => {
            return (s.structureType == STRUCTURE_ROAD ||
                    s.structureType == STRUCTURE_TOWER || 
                    s.structureType == STRUCTURE_CONTAINER) &&
                    s.hits < s.hitsMax - 1500;
        }
    });

    if (structure.length) {
        room.memory.towerController.structure = structure[0].id;
    } else {
        room.memory.towerController.structure = undefined;
    }

}

module.exports = {
    towerController
}