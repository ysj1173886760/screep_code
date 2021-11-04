const mountRoompos = require('./mount.roompos');
const PriorityQueue = require('./priority_queue');
const { roomSend } = require('./utils');

/**
 * 
 * @param {RoomPosition} from 
 * @param {RoomPosition} to 
 */
function squadFindPath(from, to) {
    const terrain = new Room.Terrain(from.roomName);

    let mp = new Array();
    for (let i = 0; i < 50; i++) {
        mp[i] = new Array();
        for (let j = 0; j < 50; j++) {
            const tile = terrain.get(x, y);
            const weight = 
                tile == TERRAIN_MASK_WALL   ? 255 :
                tile == TERRAIN_MASK_SWAMP  ?   5 :
                                                1 ;
            mp[i][j] = {
                x: i,
                y: j,
                direction: '',
                visited: false,
                dis: 0xFFFF,
                weight: weight
            };
        }
    }

    let pq = new PriorityQueue();
    mp[from.x][from.y].dis = 0;
    mp[from.x][from.y].dis = 0;
    pq.enqueue({
        w: 0,
        x: from.x,
        y: from.y,
    });
    const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
    const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
    const d = [TOP_LEFT, TOP, TOP_RIGHT, LEFT, RIGHT, BOTTOM_LEFT, BOTTOM, BOTTOM_RIGHT];

    while (pq.tree.length > 0) {
        let cur = pq.getFirst();
        if (mp[cur.x][cur.y].visited) {
            continue;
        }

        mp[cur.x][cur.y].visited = true;
        for (let i = 0; i < 8; i++) {
            let nx = cur.x + dx[i];
            let ny = cur.y + dy[i];
            if (nx < 0 || ny < 0 || nx > 49 || ny > 49) {
                continue;
            }

        }
    }
    return null;
}

function canMove(squad, direction) {
    let creep0 = Game.getObjectById(squad.creeps[0]);
    let creep1 = Game.getObjectById(squad.creeps[1]);
    let creep2 = Game.getObjectById(squad.creeps[2]);
    let creep3 = Game.getObjectById(squad.creeps[3]);

    if (creep0.pos.roomName != creep1.pos.roomName || 
        creep0.pos.roomName != creep2.pos.roomName ||
        creep0.pos.roomName != creep3.pos.roomName) {
        return true;
    }

    let array = [];
    for (let i = 0; i < 4; i++) {
        array.push(Game.getObjectById(squad.creeps[i]));
    }

    // const d = [0, TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]
    const dx = [0, 0, 1, 1, 1, 0, -1, -1, -1];
    const dy = [0, -1, -1, 0, 1, 1, 1, 0, -1];
    const room = Game.getObjectById(squad.creeps[0]).room;
    const terrain = new Room.Terrain(room.name);
    let res = true;
    for (let i = 0; i < 4; i++) {
        let creep = array[i];
        let nx = creep.pos.x + dx[direction];
        let ny = creep.pos.y + dy[direction];
        if (nx < 0 || ny < 0 || nx > 49 || ny > 49) {
            continue;
        }


        if (terrain.get(nx, ny) == TERRAIN_MASK_WALL) {
            res = false;
            break;
        }

        let s = room.lookForAt(LOOK_STRUCTURES, nx, ny);
        if (s.length) {
            for (let s0 of s) {
                if (!(s0.structureType == STRUCTURE_ROAD || s0.structureType == STRUCTURE_CONTAINER ||
                    (s0.structureType == STRUCTURE_RAMPART && s0.my))) {
                    res = false;
                    break;
                }
            }
        }
        s = room.lookForAt(LOOK_CREEPS, nx, ny); 
        if (s.length) {
            for (let s0 of s) {
                if (squad.creeps.indexOf(s0.id) == -1) {
                    res = false;
                    break;
                }
            }
        }
    }

    return res;
}

function squadMove(squad, pos) {
    let creep0 = Game.getObjectById(squad.creeps[0]);
    let creep1 = Game.getObjectById(squad.creeps[1]);
    let creep2 = Game.getObjectById(squad.creeps[2]);
    let creep3 = Game.getObjectById(squad.creeps[3]);

    if (squad.moving_position == undefined || 
        squad.moving_position.x != pos.x || 
        squad.moving_position.y != pos.y ||
        squad.moving_position.roomName != pos.roomName) {
        // cache it
        squad.moving_position = {
            x: pos.x,
            y: pos.y,
            roomName: pos.roomName
        }
        
        if (!creep0) {
            return;
        }

        let path = creep0.pos.findPathTo(pos, {
            ignoreCreeps: true
        });
        squad.path = path;
    }

    if (!squad.path || !squad.path.length) {
        let path = creep0.pos.findPathTo(pos, {
            ignoreCreeps: true
        });
        squad.path = path;
    }

    if (squad.path && squad.path.length) {
        let res = true;
        let moving = false;
        let shifting = false;
        let next_direction = squad.path[0].direction;
        if (!changeDirection(squad.direction, next_direction, squad)) {
            if (canMove(squad, next_direction)) {
                moving = true;
                for (let i = 0; i < squad.creeps.length; i++) {
                    let creep = Game.getObjectById(squad.creeps[i]);
                    if (creep.move(next_direction) != OK) {
                        res = false;
                    }
                }
            } else {
                let tryMove = [];
                switch(next_direction) {
                case TOP:
                    tryMove = [TOP_LEFT, TOP_RIGHT, LEFT, RIGHT];
                    break;
                case TOP_LEFT:
                    tryMove = [LEFT, TOP, BOTTOM_LEFT, TOP_RIGHT];
                    break;
                case LEFT:
                    trymove = [BOTTOM_LEFT, TOP_LEFT, BOTTOM, TOP];
                    break;
                case BOTTOM_LEFT:
                    tryMove = [BOTTOM, LEFT, BOTTOM_RIGHT, TOP_LEFT];
                    break;
                case BOTTOM:
                    tryMove = [BOTTOM_RIGHT, BOTTOM_LEFT, RIGHT, LEFT];
                    break;
                case BOTTOM_RIGHT:
                    tryMove = [RIGHT, BOTTOM, TOP_RIGHT, BOTTOM_LEFT];
                    break;
                case RIGHT:
                    tryMove = [TOP_RIGHT, BOTTOM_RIGHT, TOP, BOTTOM];
                    break;
                case TOP_RIGHT:
                    tryMove = [TOP, RIGHT, TOP_LEFT, BOTTOM_RIGHT];
                    break;
                }
                creep0.say('shifting');
                for (let dir of tryMove) {
                    if (canMove(squad, dir)) {
                        moving = true;
                        shifting = true;
                        for (let i = 0; i < squad.creeps.length; i++) {
                            let creep = Game.getObjectById(squad.creeps[i]);
                            if (creep.move(dir) != OK) {
                                res = false;
                            }
                        }
                        break;
                    }
                }
                if (!moving) {
                    moving = true;
                    shifting = true;
                    turnLeft(squad);
                }
            }
        }

        if (moving && res) {
            if (shifting) {
                delete squad.path;
            } else {
                squad.path.shift();
            }
        } else if (moving && !res) {
            for (let i = 0; i < squad.creeps.length; i++) {
                let creep = Game.getObjectById(squad.creeps[i]);
                creep.cancelOrder('move');
            }
        }
    }
}

function turnLeft(squad) {
    let creep0 = Game.getObjectById(squad.creeps[0]);
    let creep1 = Game.getObjectById(squad.creeps[1]);
    let creep2 = Game.getObjectById(squad.creeps[2]);
    let creep3 = Game.getObjectById(squad.creeps[3]);

    switch (squad.direction) {
    case TOP:
        creep0.move(BOTTOM);
        creep1.move(LEFT);
        creep2.move(RIGHT);
        creep3.move(TOP);
        squad.direction = LEFT;
        break;

    case LEFT:
        creep0.move(RIGHT);
        creep1.move(BOTTOM);
        creep2.move(TOP);
        creep3.move(LEFT);
        squad.direction = BOTTOM;
        break;

    case BOTTOM:
        creep0.move(TOP);
        creep1.move(RIGHT);
        creep2.move(LEFT);
        creep3.move(BOTTOM);
        squad.direction = RIGHT;
        break;

    case RIGHT:
        creep0.move(LEFT);
        creep1.move(TOP);
        creep2.move(BOTTOM);
        creep3.move(RIGHT);
        squad.direction = TOP;
        break;
    }
}

function turnRight(squad) {
    let creep0 = Game.getObjectById(squad.creeps[0]);
    let creep1 = Game.getObjectById(squad.creeps[1]);
    let creep2 = Game.getObjectById(squad.creeps[2]);
    let creep3 = Game.getObjectById(squad.creeps[3]);

    switch (squad.direction) {
    case TOP:
        creep0.move(RIGHT);
        creep1.move(BOTTOM);
        creep2.move(TOP);
        creep3.move(LEFT);
        squad.direction = RIGHT;
        break;

    case LEFT:
        creep0.move(TOP);
        creep1.move(RIGHT);
        creep2.move(LEFT);
        creep3.move(BOTTOM);
        squad.direction = TOP;
        break;

    case BOTTOM:
        creep0.move(LEFT);
        creep1.move(TOP);
        creep2.move(BOTTOM);
        creep3.move(RIGHT);
        squad.direction = LEFT;
        break;

    case RIGHT:
        creep0.move(BOTTOM);
        creep1.move(LEFT);
        creep2.move(RIGHT);
        creep3.move(TOP);
        squad.direction = BOTTOM;
        break;
    }

}

function turnBack(squad) {
    let creep0 = Game.getObjectById(squad.creeps[0]);
    let creep1 = Game.getObjectById(squad.creeps[1]);
    let creep2 = Game.getObjectById(squad.creeps[2]);
    let creep3 = Game.getObjectById(squad.creeps[3]);

    switch (squad.direction) {
    case TOP:
        creep0.move(BOTTOM_RIGHT);
        creep1.move(BOTTOM_LEFT);
        creep2.move(TOP_RIGHT);
        creep3.move(TOP_LEFT);
        squad.direction = BOTTOM;
        break;

    case LEFT:
        creep0.move(TOP_RIGHT);
        creep1.move(BOTTOM_RIGHT);
        creep2.move(TOP_LEFT);
        creep3.move(BOTTOM_LEFT);
        squad.direction = RIGHT;
        break;

    case BOTTOM:
        creep0.move(TOP_LEFT);
        creep1.move(TOP_RIGHT);
        creep2.move(BOTTOM_LEFT);
        creep3.move(BOTTOM_RIGHT);
        squad.direction = TOP;
        break;

    case RIGHT:
        creep0.move(BOTTOM_LEFT);
        creep1.move(TOP_LEFT);
        creep2.move(BOTTOM_RIGHT);
        creep3.move(TOP_RIGHT);
        squad.direction = LEFT;
        break;
    }
}

function changeDirection(cur_direction, next_direction, squad) {
    if (cur_direction == TOP) {
        switch (next_direction) {
        case TOP_LEFT:
        case TOP_RIGHT:
        case TOP:
            return false;

        case BOTTOM:
        case BOTTOM_LEFT:
        case BOTTOM_RIGHT:
            turnBack(squad);
            return true;

        case LEFT:
            turnLeft(squad);
            return true;

        case RIGHT:
            turnRight(squad);
            return true;
        }

    } else if (cur_direction == LEFT) {
        switch (next_direction) {
        case TOP_LEFT:
        case LEFT:
        case BOTTOM_LEFT:
            return false;
        
        case RIGHT:
        case TOP_RIGHT:
        case BOTTOM_RIGHT:
            turnBack(squad);
            return true;
        
        case TOP:
            turnRight(squad);
            return true;
        
        case BOTTOM:
            turnLeft(squad);
            return true;
        }

    } else if (cur_direction == BOTTOM) {
        switch (next_direction) {
        case BOTTOM:
        case BOTTOM_LEFT:
        case BOTTOM_RIGHT:
            return false;
        
        case LEFT:
            turnRight(squad);
            return true;
        
        case RIGHT:
            turnLeft(squad);
            return true;
        
        case TOP:
        case TOP_RIGHT:
        case TOP_LEFT:
            turnBack(squad);
            return true;
        }

    } else if (cur_direction == RIGHT) {
        switch (next_direction) {
        case TOP_RIGHT:
        case RIGHT:
        case BOTTOM_RIGHT:
            return false;
        
        case TOP:
            turnLeft(squad);
            return true;
        
        case BOTTOM:
            turnRight(squad);
            return true;
        
        case LEFT:
        case TOP_LEFT:
        case BOTTOM_LEFT:
            turnBack(squad);
            return true;
        }
    }
}

function leftShift(squad) {
    let res = true;
    let dir;
    switch (squad.direction) {
    case TOP:
        dir = LEFT;
        break;
    case LEFT:
        dir = BOTTOM;
        break;
    case BOTTOM:
        dir = RIGHT;
        break;
    case RIGHT:
        dir = TOP;
        break;
    }
    if (canMove(squad, dir)) {
        for (let i = 0; i < squad.creeps.length; i++) {
            let creep = Game.getObjectById(squad.creeps[i]);
            creep.say('shifting');
            if (creep.move(dir) != OK) {
                res = false;
            }
        }
    }
    if (!res) {
        for (let i = 0; i < squad.creeps.length; i++) {
            let creep = Game.getObjectById(squad.creeps[i]);
            creep.cancelOrder('move');
        }
    }
}

function checkSquad(squad) {
    let res = false;
    let creep0 = Game.getObjectById(squad.creeps[0]);
    let creep1 = Game.getObjectById(squad.creeps[1]);
    let creep2 = Game.getObjectById(squad.creeps[2]);
    let creep3 = Game.getObjectById(squad.creeps[3]);

    // don't check interroom
    if (creep0.pos.roomName != creep1.pos.roomName || 
        creep0.pos.roomName != creep2.pos.roomName ||
        creep0.pos.roomName != creep3.pos.roomName) {
        return true;
    }

    switch(squad.direction) {
    case TOP:
        if (creep0.pos.x == creep1.pos.x - 1 && creep0.pos.y == creep1.pos.y &&
            creep0.pos.x == creep2.pos.x && creep0.pos.y == creep2.pos.y - 1 &&
            creep0.pos.x == creep3.pos.x - 1 && creep0.pos.y == creep3.pos.y - 1) {
            res = true;
        }
        break;
    case LEFT:
        if (creep0.pos.x == creep1.pos.x && creep0.pos.y == creep1.pos.y + 1 &&
            creep0.pos.x == creep2.pos.x - 1 && creep0.pos.y == creep2.pos.y &&
            creep0.pos.x == creep3.pos.x - 1 && creep0.pos.y == creep3.pos.y + 1) {
            res = true;
        }
        break;
    case BOTTOM:
        if (creep0.pos.x == creep1.pos.x + 1 && creep0.pos.y == creep1.pos.y &&
            creep0.pos.x == creep2.pos.x && creep0.pos.y == creep2.pos.y + 1 &&
            creep0.pos.x == creep3.pos.x + 1 && creep0.pos.y == creep3.pos.y + 1) {
            res = true;
        }
        break;
    case RIGHT:
        if (creep0.pos.x == creep1.pos.x && creep0.pos.y == creep1.pos.y - 1 &&
            creep0.pos.x == creep2.pos.x + 1 && creep0.pos.y == creep2.pos.y &&
            creep0.pos.x == creep3.pos.x + 1 && creep0.pos.y == creep3.pos.y - 1) {
            res = true;
        }
    }
    return res;
}

module.exports = {
    squadMove,
    leftShift,
    checkSquad,
    turnLeft
}