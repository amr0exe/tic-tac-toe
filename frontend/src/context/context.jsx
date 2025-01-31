import { useState } from "react";
import { createContext } from "react";

const MyContext = createContext("thsi")

// eslint-disable-next-line react/prop-types
export const MyContextProvider = ({ children }) => {
    const [roomId, setRoomId] = useState("")

    return (
        <MyContext.Provider value={{roomId, setRoomId}}>
            {children}
        </MyContext.Provider>
    )
}


export default MyContext
