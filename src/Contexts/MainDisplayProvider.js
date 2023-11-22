import { createContext, useState } from "react";

const MainContext = createContext(null);
const MainDispatchContext = createContext(null);

const MainDisplayProvider = ({children}) => {
    const [selectedChat, setSelectedChat] = useState("");

    return ( 
        <MainContext.Provider value = {selectedChat}>
            <MainDispatchContext.Provider value = {setSelectedChat}>
                {children}    
            </MainDispatchContext.Provider> 
        </MainContext.Provider>

    );
}

export {MainDisplayProvider, MainContext, MainDispatchContext};