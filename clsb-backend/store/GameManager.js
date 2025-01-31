import { GameRoom } from "./GameRoom";

export class GameManager {
    constructor() {
        this.rooms = new Map()
        this.playerRooms = new Map()
    }

    createRoom(roomId, ws) {
        const room = new GameRoom()
        room.addPlayer(ws)
        this.rooms.set(roomId, room)
        this.playerRooms.set(ws, roomId)
        return room
    }

    joinRoom(roomId, ws) {
        const room = this.rooms.get(roomId)
        if (!room || room.players.size >= 2) return false

        room.addPlayer(ws)
        this.playerRooms.set(ws, roomId)
        return true
    }

    handleDisconnect(ws) {
        const roomId = this.playerRooms.get(ws)
        if (!roomId) return

        const room = this.rooms.get(roomId)
        room.players.delete(ws)

        if (room.players.size === 0) {
            this.rooms.delete(roomId)
        }

        this.playerRooms.delete(ws)
    }
}
