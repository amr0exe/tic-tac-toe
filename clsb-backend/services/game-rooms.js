import gameState from "../store/state.js"

const joinGameRoom = (ws, roomId) => {
    if (!gameState.gameRooms.has(roomId)) {
        gameState.gameRooms.set(roomId, {})  
    }
} 
