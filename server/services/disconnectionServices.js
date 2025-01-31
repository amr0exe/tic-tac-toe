import { gameState } from "../store/store.js"
import { reset_board } from "./moveFilterServices.js"

const handleDisconnect = (ws) => {
    // check if player exists in any of present-rooms
    for (const [roomId, players] of gameState.gameRoom.entries()) {
        if (players.has(ws)) {
            // delete that player-entry
            players.delete(ws)

            // if room-empty -> delete it
            if (players.size === 0) {
                gameState.gameRoom.delete(roomId)
                console.log(`Room ${roomId} deleted! - due2no players remaining`)
            }

            // remove from player map
            gameState.players.delete(ws)

            if (players.size === 1) {
                // reset-game
                reset_board()
            }
        } 
    }
}

export { handleDisconnect }
