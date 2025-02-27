import { useState, useRef, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import MyContext from "../context/context"

function Game() {
    const [board, setBoard] = useState(Array(9).fill(null))
    const {roomId } =  useContext(MyContext)
    const [winner, setWinner] = useState("playing")
    const [turn, setTurn] = useState(" X")
    const [playerType, setPlayerType] = useState("")

    const navigate = useNavigate()
    const socket = useRef(null)
    const isMounted = useRef(false)

    useEffect(() => {
        isMounted.current = true
        if (roomId === "") { return navigate("/") }

        if (socket.current === null) {
            socket.current = new WebSocket("ws://localhost:8080")
        }

        socket.current.onopen = () => {
            console.log("Websocket connection initated!")

            if(roomId) {
                console.log("here the room", roomId)

                socket.current.send(JSON.stringify({
                    type: "join-room",
                    roomId
                }))
            }
        }

        socket.current.onmessage = (event) => {
            const data = JSON.parse(event.data)
            console.log(data)

            switch (data.type) {

                case "move":
                    setBoard(data.board)
                    setTurn(data.turn)
                    console.log("board is this: ", data.board)
                    break

                case "game-end":
                    if (data.draw) {
                        console.log("Its a draw!")
                    } 
                    setWinner(data.winner)
                    console.log(data.winner, " won the game!")
                    break

                case "room-full":
                    navigate("/")
                    console.log("Room-full!, join anotherOne...")
                    break
                
                case "game-reset":
                    setBoard(data.board)
                    setWinner("playing")
                    break

                case "player-type":
                    setPlayerType(data.name)
                    break
            }
        }

        socket.current.onclose = () => {
            console.log("Websocket closed!")
        }

        socket.current.onerror = (err) => {
            console.error("Websocket erro!", err)
        }

        return () => {
            if (socket.current && socket.current.readyState === WebSocket.OPEN) {
                socket.current.close()
            }

            isMounted.current = false
        }

    }, [navigate, roomId])

    const handleClick = (index) => {
       socket.current.send(JSON.stringify({ 
        type: "move", 
        roomId: roomId,
        index: index
    })) 
    }

    const handleReset = () => {
        socket.current.send(JSON.stringify({ 
            type: "reset-board",
            roomId
        }))
    }

    return <div className="h-screen font-mono flex justify-center items-center">

        <div className="mt-16 flex flex-col items-center">
            {/* GameState */}
            <div>
                <p className="text-center text-slate-700 text-2xl">GameState</p>
                <p className="text-center text-slate-500">room: {roomId}</p>
                <p className="text-center text-slate-500 mb-5">
                    winner | {winner} | 
                    {winner === "playing" && <span> {turn}&apos;s turn</span>}
                </p>
                <p className="text-center text-slate-500">player {playerType}</p>
            </div>

            {/* Board */}
            <div className="w-fit grid grid-cols-3">
                {board.map( (value, index) => {
                    return (
                        <button 
                            key={index}
                            onClick={() => handleClick(index)}
                            className="w-20 h-20 border border-slate-300 cursor-crosshair"
                        >{value}</button>
                    )
                })}
            </div>

            <button 
                className="p-3 mt-5 rounded-sm bg-blue-400 text-white cursor-pointer"
                onClick={handleReset}
            >Reset</button>
        </div>

    </div>
}


export default Game