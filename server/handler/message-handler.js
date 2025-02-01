import { joinGameRoom, broadcast_to_room } from "../services/gameroomServices.js"
import { reset_board } from "../services/moveFilterServices.js"


/*const broadcast_move = (ws, move, turn) => { 
    wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "move",
                move: move,
                turn: turn
            }))
        }
    })
}*/


const messageHandler = (ws, msg) => {
    try {
        const data = JSON.parse(msg)

        switch (data.type) {
            case "join-room":
                //let roomId = generateRoom()
                joinGameRoom(ws, data.roomId)
                break

            case "move":
                broadcast_to_room(ws, data.roomId, Number(data.index))
                //broadcast_move(ws, data.move, data.turn)
                break

            case "reset-board":
                reset_board(ws, data.roomId)
                break

            default: 
                console.log("unknown message type", data.type)
                return
        }

    } catch(err) {
        console.log("Error processing message!", err)
    }
}

export { messageHandler }

