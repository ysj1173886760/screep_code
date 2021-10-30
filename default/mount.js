const mountCreep = require("./mount.creep");
const mountRoomPos = require("./mount.roompos");
const mountRoom = require("./mount.room");

module.exports = function() {
    console.log('re-mounting extension');
    mountRoomPos();
    mountCreep();
    mountRoom();
}