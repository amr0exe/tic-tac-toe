import { gameState, winningCombos  } from "../store/state.js"

const validateMove = (index, game) => {
    if (game.board[index] !== null) {
        console.log("Invalid move, Space already occupied!")
        return false
    }
    return true
}

const checkGameState = ( ws, game, roomId) => {
    const board = game.board
    const room = gameState.gameRooms.get(roomId)

    for (let combo of winningCombos) {
        const [a, b, c] = combo
        // comparing combos for same mark
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            game.gameEnded = true
            game.winner = board[a]

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

    // for draw when no empty-cell available
    if (!board.includes(null)) {
        game.gameEnded = true

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
    const room = gameState.gameRooms.get(roomId)

    if (!game || !room) {
        console.log("Game | Room doesn't exists")
        return
    }

    game.reset()

    room.forEach( client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "game-reset",
                board: game.board
            }))
        }
    })
}

export { validateMove, checkGameState, reset_board }
