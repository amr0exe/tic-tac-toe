import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import MyContext from "../context/context"

function Room() {
    const navigate = useNavigate()
    const { setRoomId } = useContext(MyContext) 

    const joinRoom = () => {
        navigate("/game")
    }

    return (
        <div className="h-screen font-mono flex flex-col items-center">
            <h1 className="text-3xl mt-56">Here The Room!</h1>

            {/* Room Logic */}
            <div className="mt-4 flex items-center gap-5">
                <input 
                    className="border rounded pl-3 p-2 mr-2" 
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="roomId"
                />
                
                <div className="h-15 border-l-2 border-slate-400"></div>

                <button 
                    onClick={joinRoom}
                    className="cursor-pointer  px-3 py-2 rounded hover:bg-blue-400"
                >Join</button>
            </div>
        </div>
    )
}

export default Room