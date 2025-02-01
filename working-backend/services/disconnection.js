import { gameState } from "../store/state.js"
import { reset_board } from "./moves-filter.js"

const handleDisconnect = (ws) => {
    for (const [roomId, players] of gameState.gameRooms.entries()) {
        if (players.has(ws)) {              // when there is current-ws in room
            const game = gameState.games.get(roomId)
            if (game) {
                game.players.delete(ws)     // delete that player from current game-instance
            }
            players.delete(ws)              // delete ws-client from room-records

            players.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        "type": "player-disconnected",
                    }))
                }
            })

            if (players.size === 0) {
                gameState.gameRooms.delete(roomId)  // no-player -> empty-room -> delete it
                gameState.games.delete(roomId)      // no-player -> empty-game-instance -> delete it
                console.log(`Room ${roomId} deleted`)
            }
            else if (players.size === 1) {
                reset_board(ws, roomId)             // reset-board when there is one player left
            }
            break
        }
    }
}

export { handleDisconnect }
