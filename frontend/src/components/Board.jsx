import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"

function Board() {
    const [board, setBoard] = useState(Array(9).fill(null))
    const [isXturn, setIsXturn] = useState(true)
    const [gameEnded, setGameEnded] = useState(false)
    const [isDraw, setIsDraw] = useState(false)

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5,  8], // columns
        [0, 4, 8], [2, 4, 6]    // diagonal
    ]

    const socket = useRef(null)

    useEffect(() => {
        socket.current = new WebSocket("ws://localhost:8080")

        socket.current.onopen = () => { 
            console.log("websocket connection init!") 
        }

        socket.current.onmessage = (event) => {
            const parsedData = JSON.parse(event.data)
            console.log(parsedData)


            switch (parsedData.type) {
                case "move":
                    setBoard(parsedData.move)
                    if (checkGameState(parsedData.move)) {
                        return
                    }
                    setIsXturn(parsedData.turn)
            
                    console.log("move is ", parsedData.move)
                    break

                case "reset-board":
                    setBoard(Array(9).fill(null))
                    setGameEnded(false)
                    setIsDraw(false)
                    setIsXturn(true)
                    break
            }
        }

        socket.current.onclose = () => { 
            console.log("websocket connection closed!") 
        }

        return () => {
            if (socket.current) {
                socket.current.close()
            }
        }

    }, [])

    const handleClick = (index) => {
        // main is to update the board in correct index
        // get the board & change it but how?

        // getBoard -> board[index] = "CurrentPlayer"
        // since react doesn't promote direct state mutation

        // tempBoard = [...board] // destruct the realBoard
        // tempBoard[index] -> setBoard(tempBoard)
        
        // have to check if the move is valid or not
        // when to check for move validation

        if (gameEnded || board[index]) return

        const tempBoard = [...board]

        // choose which player's turns 
        isXturn ? tempBoard[index] = "X" : tempBoard[index] = "O"
        if (!validateMove(index)) {
            return
        }
        setBoard(tempBoard) // update board state

        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                "type" : "move",
                "move" : tempBoard,
                "turn" : !isXturn
                
            }))
        }

        // check game progress (win | draw | loss)
        if (checkGameState(tempBoard)) {
            console.log("game ended")
            return
        }


        // AtLast, change to other players turn
        setIsXturn(!isXturn) 

        // setBoard(Array(9).fill(null))
        // console.log("Clicked", index)
         console.log("board", tempBoard)
    }

    const validateMove = (index) => {
        // get board state
        // check if its empty or not

        if (board[index] !== null) {
            console.log("Invalid Move! Space already occupied!")
            return false
        }

        // validate when its correct
        return true
    }

    const reset_game = () => {  
        if (socket.current && socket.current.readyState === WebSocket.OPEN) {
            socket.current.send(JSON.stringify({
                "type" : "reset-board",
            }))
        }
    }

    const checkGameState = (tempBoard) => {
        // check for winning Combos
        for (let combo of winningCombos) {
            const [a, b, c] = combo
            if (tempBoard[a] && tempBoard[a] === tempBoard[b] && tempBoard[a] === tempBoard[c]) {
                setGameEnded(true)
                console.log(tempBoard[a], " won the game")
                return true 
            }
        }

        // check for draw
        if (!tempBoard.includes(null)) {
            setGameEnded(true)
            setIsDraw(true)
            console.log("Gamed tied!")
            return true
        }

        // when game in-progres
        return false 

    }

    return ( 
        <div className="flex items-center gap-20">

            {/* Score Board */}
            <div>
                <p>Player X: {0}</p>
                <p>Player O: {0}</p>
            </div>

            {/* Actual Board */}
            <div className="w-fit grid grid-cols-3">  
                {
                    board.map((value, index) => {
                        return (
                            <button 
                                key={index}
                                className="w-16 h-16 border border-slate-300 cursor-crosshair"
                                onClick={() => handleClick(index)}
                            >{value}</button>)
                    })
                }
            </div>

            <div className="flex flex-col items-center">
                <div className="font-bold mb-9">
                    {gameEnded && !isDraw && <p>{isXturn ? "X " : "O "} won the game</p>}
                    {gameEnded && isDraw && <p>Game Tied!</p>}
                </div>
                    
                <p className=""> 
                    {isXturn ? ' X' : ' O'}&apos;s turn</p>
                <button 
                    onClick={() => reset_game()}
                    className="p-2 rounded-sm bg-blue-400 text-white"
                >Reset</button>
            </div>
 
        </div>
   )
}

export default Board


/*
{
    "type": "move",
    "roomId": "games",
    "index": 3
}

{
    "type": "join-room",
    "roomId": "games"
}

*/