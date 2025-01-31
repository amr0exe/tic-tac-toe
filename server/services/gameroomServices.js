import { gameState } from "../store/store.js"
import { checkGameState, validateMove } from "./moveFilterServices.js"

const joinGameRoom = (ws, roomId) => {
    // check if that room exists (its means first player -> playerX)
        // if not create an room with current user as playerX
    
    // if room exists   (it means second player -> playerO)
        // make the client join as playerO

    // for room doesn't exists
    if (!gameState.gameRoom.has(roomId) || gameState.gameRoom.size === 0) {
        // create room with current ws as playerX
        gameState.gameRoom.set(roomId, new Set([ws]))

        // assing first ws as playerX
        gameState.players.set(ws, "X")
        console.log("these are rooms and players ", gameState.gameRoom, gameState.players.values())
        return
    }

    const currentRoom = gameState.gameRoom.get(roomId)
    if (currentRoom.size >= 2) {
        console.log("room full! getout...")
        ws.send(JSON.stringify({
            type: "room-full"
        }))
        return
    }

    // for room exits
    // add ws in room
    gameState.gameRoom.get(roomId).add(ws)

    // assigning second ws as playerO
    gameState.players.set(ws, "O")

    
    // info-logging
    console.log("Room size: ", currentRoom.size)
    console.log("these are rooms and players ", gameState.gameRoom, gameState.players.values())
}

const broadcast_to_room = (ws, roomId, index) => {
    // if gameEnded or duplicate move => return immediately
    if (gameState.gameEnded || gameState.board[index]) return 

    // check for room existence
    if (!gameState.gameRoom.has(roomId)) {
        console.log("Room doesn't exists")
        return
    }

    if (!validateMove(index)) {
        return
    }
    gameState.board[index] = gameState.turn

    const players = gameState.gameRoom.get(roomId).values()
    players.forEach( client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                "type": "move",
                "board": gameState.board
            }))
        }
    })

    console.log("board", gameState.board)

    if (checkGameState(ws)) {
        return
    }

    if (gameState.turn === 'O') {
        gameState.turn = 'X'
        return
    }
    gameState.turn = 'O'
}

export { joinGameRoom, broadcast_to_room }
