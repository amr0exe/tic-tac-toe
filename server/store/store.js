
const gameState = {
    board: Array(9).fill(null),
    gameRoom: new Map(),
    players: new Map(),
    spectator: new Map(),
    turn: 'X',
    gameEnded: false,
    winner: null
}

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5,  8], // columns
    [0, 4, 8], [2, 4, 6]    // diagonal
]


export { gameState, winningCombos }
