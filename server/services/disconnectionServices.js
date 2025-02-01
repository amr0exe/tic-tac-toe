import { gameState } from "../store/store.js"
import { reset_board } from "./moveFilterServices.js"

const handleDisconnect = (ws) => {
    // check if player exists in any of present-rooms
    for (const [roomId, players] of gameState.gameRoom.entries()) {
        if (players.has(ws)) {
            const game = gameState.games.get(roomId)

            // delete that player-entry
            if (game) {
                game.players.delete(ws)
            }

            players.delete(ws)

            players.forEach( client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        type: "player-disconnected",
                        message: "Opponent gones"
                    }))
                }
            })

            if (players.size === 0) {
                gameState.gameRoom.delete(roomId)
                gameState.games.delete(roomId)
                console.log(`Room ${roomId} deleted`)
            }

            else if (players.size == 1) {
                reset_board(ws, roomId)
            }
            break
        } 
    }
}

export { handleDisconnect }
