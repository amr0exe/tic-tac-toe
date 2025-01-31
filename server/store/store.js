
const gameState = {
    games: new Map(),
    gameRoom: new Map(),
    spectator: new Map()
}

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5,  8], // columns
    [0, 4, 8], [2, 4, 6]    // diagonal
]

export class Game {
    constructor() {
        this.board = Array(9).fill(null)
        this.players = new Map()
        this.turn = 'X'
        this.gameEnded = false
        this.winner = null
    }

    reset() {
        this.board = Array(9).fill(null)
        this.turn = 'X'
        this.gameEnded = false
        this.winner = null
    }
}

export { gameState, winningCombos }