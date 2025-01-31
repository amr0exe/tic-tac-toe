import { gameState, winningCombos } from "../store/store.js"

const validateMove = (index) => {
    if (gameState.board[index] !== null) {
        console.log("Invalid move, Space already occupied!")
        return
    }

    return true
}

const checkGameState = (client) => {
    const board = gameState.board

    for (let combo of winningCombos) {
        const [a, b, c] = combo
        if (board[a] && board[a] == board[b] && board[a] == board[c]) {
            gameState.gameEnded = true
            gameState.winner = board[a]

            // send to client
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: "game-end",
                    winner: gameState.winner,
                    draw: false
                }))
            }


            console.log("Game Ended", "winner is ", board[a])
            return true
        }
    } 

    if (!board.includes(null)) {
        console.log("Its a draw")
        gameState.gameEnded = true

        // send to client
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "game-end",
                draw: true
            }))
        } 
        
        return true
    }

    return false
}

const reset_board = () => {
    gameState.board = Array(9).fill(null)
    gameState.turn = 'X'
    gameState.gameEnded = false
    gameState.winner = null
}

export { validateMove, checkGameState, reset_board }
