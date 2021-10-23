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

    if (squad.path && squad.path.length) {
        let res = true;
        let moving = false;
        let next_direction = squad.path[0].direction;
        console.log("pre: " + squad.direction, next_direction);
        if (!changeDirection(squad.direction, next_direction, squad)) {
            moving = true;
            for (let i = 0; i < squad.creeps.length; i++) {
                let creep = Game.getObjectById(squad.creeps[i]);
                if (creep.move(next_direction) != OK) {
                    res = false;
                }
            }
        }
        console.log("after: " + squad.direction);

        if (moving && res) {
            squad.path.shift();
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
            turnBack(squad);
            return true;

        case LEFT:
        case BOTTOM_LEFT:
            turnLeft(squad);
            return true;

        case RIGHT:
        case BOTTOM_RIGHT:
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
            turnBack(squad);
            return true;
        
        case TOP_RIGHT:
        case TOP:
            turnRight(squad);
            return true;
        
        case BOTTOM:
        case BOTTOM_RIGHT:
            turnLeft(squad);
            return true;
        }

    } else if (cur_direction == BOTTOM) {
        switch (next_direction) {
        case BOTTOM:
        case BOTTOM_LEFT:
        case BOTTOM_RIGHT:
            return false;
        
        case TOP_LEFT:
        case LEFT:
            turnRight(squad);
            return true;
        
        case TOP_RIGHT:
        case RIGHT:
            turnLeft(squad);
            return true;
        
        case TOP:
            turnBack(squad);
            return true;
        }

    } else if (cur_direction == RIGHT) {
        switch (next_direction) {
        case TOP_RIGHT:
        case RIGHT:
        case BOTTOM_RIGHT:
            return false;
        
        case TOP_LEFT:
        case TOP:
            turnLeft(squad);
            return true;
        
        case BOTTOM:
        case BOTTOM_LEFT:
            turnRight(squad);
            return true;
        
        case LEFT:
            turnBack(squad);
            return true;
        }
    }
}

module.exports = {
    squadMove
}