function squadMove(squad, pos) {
    let creep0 = squad.creeps[0];
    let creep1 = squad.creeps[1];
    let creep2 = squad.creeps[2];
    let creep3 = squad.creeps[3];

    if (squad.moving_position == undefined || 
        squad.moving_position.x != pos.x || 
        squad.moving_position.y != pos.y ||
        squad.moving_position.roomName != pos.roomName) {
        // cache it
        squad.moving_position.x = pos.x;
        squad.moving_position.y = pos.y;
        squad.moving_position.roomName = pos.roomName;
        
        if (!creep0) {
            return;
        }

        let path = creep0.pos.findPathTo(pos);
        squad.path = path;
    }

    if (squad.path && squad.path.length) {
        let res = true;
        let next_direction = squad.path[0];
        if (!changeDirection(squad.direction, next_direction, squad)) {
            for (let i = 0; i < squad.creeps.length; i++) {
                if (squad.creeps[i].move(next_direction) != OK) {
                    res = false;
                }
            }
        }
        if (!res) {
            for (let i = 0; i < squad.creeps.length; i++) {
                squad.creeps[i].cancelOrder('move');
            }
        }
    }
}

function turnLeft(squad) {
    let creep0 = squad.creeps[0];
    let creep1 = squad.creeps[1];
    let creep2 = squad.creeps[2];
    let creep3 = squad.creeps[3];

    switch (squad.direction) {
    case TOP:
        creep0.move(BOTTOM);
        creep1.move(LEFT);
        creep2.move(RIGHT);
        creep3.move(TOP);
        break;

    case LEFT:
        creep0.move(RIGHT);
        creep1.move(BOTTOM);
        creep2.move(TOP);
        creep3.move(LEFT);
        break;

    case BOTTOM:
        creep0.move(TOP);
        creep1.move(RIGHT);
        creep2.move(LEFT);
        creep3.move(BOTTOM);
        break;

    case RIGHT:
        creep0.move(LEFT);
        creep1.move(TOP);
        creep2.move(BOTTOM);
        creep3.move(RIGHT);
    }
}

function turnRight(squad) {
    let creep0 = squad.creeps[0];
    let creep1 = squad.creeps[1];
    let creep2 = squad.creeps[2];
    let creep3 = squad.creeps[3];

    switch (squad.direction) {
    case TOP:
        creep0.move(RIGHT);
        creep1.move(BOTTOM);
        creep2.move(TOP);
        creep3.move(LEFT);
        break;

    case LEFT:
        creep0.move(TOP);
        creep1.move(RIGHT);
        creep2.move(LEFT);
        creep3.move(BOTTOM);
        break;

    case BOTTOM:
        creep0.move(LEFT);
        creep1.move(TOP);
        creep2.move(BOTTOM);
        creep3.move(RIGHT);
        break;

    case RIGHT:
        creep0.move(BOTTOM);
        creep1.move(LEFT);
        creep2.move(RIGHT);
        creep3.move(TOP);
    }
}

function turnBack(squad) {
    let creep0 = squad.creeps[0];
    let creep1 = squad.creeps[1];
    let creep2 = squad.creeps[2];
    let creep3 = squad.creeps[3];

    switch (squad.direction) {
    case TOP:
        creep0.move(BOTTOM_RIGHT);
        creep1.move(BOTTOM_LEFT);
        creep2.move(TOP_RIGHT);
        creep3.move(TOP_LEFT);
        break;

    case LEFT:
        creep0.move(TOP_RIGHT);
        creep1.move(BOTTOM_RIGHT);
        creep2.move(TOP_LEFT);
        creep3.move(BOTTOM_LEFT);
        break;

    case BOTTOM:
        creep0.move(TOP_LEFT);
        creep1.move(TOP_RIGHT);
        creep2.move(BOTTOM_LEFT);
        creep3.move(BOTTOM_RIGHT);
        break;

    case RIGHT:
        creep0.move(BOTTOM_LEFT);
        creep1.move(TOP_LEFT);
        creep2.move(BOTTOM_RIGHT);
        creep3.move(TOP_RIGHT);
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
        if (next_direction == BOTTOM || next_direction == BOTTOM_LEFT || next_direction == BOTTOM_RIGHT) {
            return false;
        }
        switch (cur_direction) {
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
        if (next_direction == TOP_RIGHT || next_direction == RIGHT || next_direction == BOTTOM_RIGHT) {
            
        }
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