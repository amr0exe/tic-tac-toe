import { Game, gameState } from "../store/state.js"
import { checkGameState, validateMove } from "./moves-filter.js"

const joinGameRoom = (ws, roomId) => {
    if (!gameState.gameRooms.has(roomId)) {
        const newGame = new Game()              // current-game-instance
        gameState.games.set(roomId, newGame)    // set-that-instance for current-room

        // firstPlayer -> X
        gameState.gameRooms.set(roomId, new Set([ws]))
        newGame.players.set(ws, 'X')
        return
    }

    const currentRoom = gameState.gameRooms.get(roomId)

    if (currentRoom.size >= 2) {                // GameRoom only allows 2 players
        console.log("Room full! get out...")
        ws.send(JSON.stringify({
            type: "room-full"
        }))
        return
    }

    currentRoom.add(ws)                         
    const game = gameState.games.get(roomId)    // get game
    game.players.set(ws, 'O')                   // add second player as O 
} 

const broadcast_to_room = (ws, roomId, index) => {
    const game = gameState.games.get(roomId) // current game-instance
    if (!game || game.gameEnded || game.board[index]) return // Exit:
    // When: noGame, game-end, duplicate-move

    if (!gameState.gameRooms.has(roomId)) {
        console.log("Room doesn't exists!")
        return
    }

    // checkPlayer(ws, roomId)
    // first get-game
    // const players = game.players
    // for (let [client, playerName] of players) {
    //      if (client === ws) {  // if matched then is current player
    //          if (playerName !== game.turn) {
    //                 return
    //          }
    //      }     
    //      console.log("No player here!")
    // }

    // logic: where only playerX can play X's moves and vice versa
    const clients = game.players
    console.log("here it is ", clients)
    for (let [client, playerName] of clients) {
        if (client === ws) {
            if (playerName !== game.turn) return
        }
        console.log("No Players here!")
    }

    if (!validateMove(index, game)) {
        return
    }

    game.board[index] = game.turn               // add mark on board

    const players = gameState.gameRooms.get(roomId)
    game.turn = game.turn === 'X' ? 'O' : 'X'
    players.forEach( client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: "move",
                board: game.board,
                turn: game.turn
            }))
        }
    })

    if (checkGameState(ws, game, roomId)) {
        return
    }
}

export { joinGameRoom, broadcast_to_room }

