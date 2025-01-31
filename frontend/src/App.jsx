import { BrowserRouter, Routes, Route } from "react-router-dom"
import Room from "./GameComponents/Room"
import Game from "./GameComponents/Game"


function App() {

  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Room />} />
          <Route path="/game" element={ <Game /> } />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App







/*
function App() {
  const { state, setState } = useContext(MyContext)
  const handleState = () => {
    setState("Chanjeeddd ahh!")
  }
  
  return (
    <div className="h-screen font-mono flex flex-col justify-center items-center">
      <div className="flex flex-col items-center">
        <p className="text-2xl font-semibold mb-10 ml-6">The Game {state}</p>
        <button 
          className="p-2 rounded-sm bg-blue-400 text-white"
          onClick={() => handleState()}
        >change State</button>

        <Board />
      </div>
    </div>
  )
}
*/

