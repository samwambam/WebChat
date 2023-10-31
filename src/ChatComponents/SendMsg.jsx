import React, { useEffect, useState } from "react"
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../backend/firebase";
import "../Styles/MainDisplay.css"

const SendMsg = ({scroll}) => {
    const [input, setInput] = useState("");
    const user = auth.currentUser;

    const submit = async (e) => {
        setInput("")
        e.preventDefault();
        await addDoc(collection(firestore, "messages"), {
            user: user.displayName,
            text: input,
            timestamp: serverTimestamp()
        })
        scroll.current.scrollIntoView({behavior: "smooth"})
    }
    
 return(
     <div>
         <form onSubmit={submit} className="sendcomponent">
             <input
                 type="text"
                 name="messagetext"
                 placeholder="Type your message here"
                 required
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
             />

             <button type="submit"> Send </button>
         </form>
     </div>
 )
}

export  default SendMsg