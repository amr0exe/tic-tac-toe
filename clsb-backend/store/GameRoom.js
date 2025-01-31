
export class GameRoom {
    constructor() {
        this.board = Array(9).fill(null);
        this.players = new Set();
        this.turn = "X";
        this.gameEnded = false;
        this.winner = null;
    }

    addPlayer(ws) {
        const symbol = this.players.size === 0 ? 'X' : 'O'
        this.players.add(ws)
        return symbol
    }

    makeMove(index, player) {
        // when game-end | duplicate-move
        if (this.gameEnded || this.board[index]) return false
        this.board[index] = this.turn
        this.turn = this.turn === 'X' ? 'O' : 'X'
        return true
    }

    checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ]

        for (let combo of winningCombos) {
            const [a, b, c] = combo
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.gameEnded = true
                this.winner = this.board[a]
                return
            }
        }

        // when no null on board but still no winner -> draw
        if (!this.board.includes(null)) {
            this.gameEnded = true
            this.winner = 'draw'
        }

        // no winner yet | game still going
        return false
    }
}
