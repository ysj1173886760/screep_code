module.exports = function() {
    _.assign(RoomPosition.prototype, roomPosExtension);
}

const roomPosExtension = {
    
    /**
     * 
     * @param {DirectionConstant} direction 
     */
    directionToPos(direction) {
        let targetX = this.x;
        let targetY = this.y;

        if (direction !== LEFT && direction !== RIGHT) {
            if (direction > LEFT || direction < RIGHT) {
                targetY--;
            } else {
                targetY++;
            }
        }

        if (direction !== TOP && direction !== BOTTOM) {
            if (direction < BOTTOM) {
                targetX++;
            } else {
                targetX--;
            }
        }

        if (targetX < 0 || targetX > 49 || targetY < 0 || targetY > 49) {
            return undefined;
        }

        return new RoomPosition(targetX, targetY, this.roomName);
    }
};