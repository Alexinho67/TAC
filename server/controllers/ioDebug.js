exports.getSocketsInRoom = (io, roomId) => {
    return Array.from(io.sockets.adapter.rooms.get(roomId))
}