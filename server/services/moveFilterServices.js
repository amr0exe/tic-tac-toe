import { gameState, winningCombos } from "../store/store.js"

const validateMove = (index, game) => {
    if (game.board[index] !== null) {
        console.log("Invalid move, Space already occupied!")
        return false
    }

    return true
}

const checkGameState = (ws, game, roomId) => {
    const board = game.board
    const room = gameState.gameRoom.get(roomId)

    for (let combo of winningCombos) {
        const [a, b, c] = combo
        if (board[a] && board[a] == board[b] && board[a] == board[c]) {
            game.gameEnded = true
            game.winner = board[a]

            // send to client
            room.forEach( client => {
                if (client.readyState === WebSocket.OPEN) { 
                    client.send(JSON.stringify({
                        type: "game-end",
                        winner: game.winner,
                        draw: false
                    }))
                }
            })
            return true
        }
    } 

    if (!board.includes(null)) {
        game.gameEnded = true
        // send to client
        room.forEach( client => {   
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "game-end",
                    draw: true
                }))
            }
        })
        return true
    }
    return false
}

const reset_board = (ws, roomId) => {
    const game = gameState.games.get(roomId)
    const room = gameState.gameRoom.get(roomId)

    if(!game || !room) {
        console.log("Game or room not found")
        return
    }

    game.reset()

    room.forEach( client => {
        if (!client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "game-reset",
                board: game.board,
                turn: game.turn
            }))
        }
    })
}

export { validateMove, checkGameState, reset_board }
