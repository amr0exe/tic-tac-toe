import { gameState, Game } from "../store/store.js"
import { checkGameState, validateMove } from "./moveFilterServices.js"

const joinGameRoom = (ws, roomId) => {
    if (!gameState.gameRoom.has(roomId)) {
        const newGame = new Game() // new Game-Instance
        gameState.games.set(roomId, newGame)

        // new-room with current ws as playerX
        gameState.gameRoom.set(roomId, new Set([ws]))
        newGame.players.set(ws, 'X')
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

    // adding second player
    currentRoom.add(ws)
    const game = gameState.games.get(roomId)
    game.players.set(ws, 'O')
}

const broadcast_to_room = (ws, roomId, index) => {
    const game = gameState.games.get(roomId)
    if (!game || game.gameEnded || game.board[index]) return

    // check for room existence
    if (!gameState.gameRoom.has(roomId)) {
        console.log("Room doesn't exists")
        return
    }

    if (!validateMove(index, game)) {
        return
    }

    game.board[index] = game.turn


    const players = gameState.gameRoom.get(roomId)
    game.turn = game.turn === 'X' ? 'O' : 'X'
    players.forEach( client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                "type": "move",
                "board": game.board,
                "turn": game.turn
            }))
        }
    })

    if (checkGameState(ws, game, roomId)) {
        return
    }
}

export { joinGameRoom, broadcast_to_room }
