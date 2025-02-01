import { joinGameRoom, broadcast_to_room } from "../services/game-rooms.js"
import { reset_board } from "../services/moves-filter.js"

const messageHandler = (ws, msg) => {
    try {
        const data = JSON.parse(msg)

        switch (data.type) {
            case "join-room":
                joinGameRoom(ws, data.roomId)
                break

            case "move":
                broadcast_to_room(ws, data.roomId, Number(data.index))
                break

            case "reset-board":
                reset_board(ws, data.roomId)
                break

            default:
                console.log("Unknown message type!", data.type)
                break
        }
    } catch (err){
        console.log("Error processing message!", err)
    }
}

export { messageHandler }
