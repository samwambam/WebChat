import React, { useContext, useState } from "react"
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { auth, firestore } from "../backend/firebase";
import "../Styles/MainDisplay.css"
import { MainContext } from "../Contexts/MainDisplayProvider";

const SendMsg = ({scroll}) => {
    const [input, setInput] = useState("");
    const user = auth.currentUser;
    const selectedChat = useContext(MainContext);

    const submit = async (e) => {
        e.preventDefault();
        if (selectedChat && input.length > 0) {
            const docRef = doc(firestore, "chats", selectedChat);
            const colRef = collection(docRef, "messages");
            await addDoc(colRef, {
                sender: user.displayName,
                text: input,
                timestamp: serverTimestamp()
            })
            scroll.current.scrollIntoView({ behavior: "smooth" });
        }
        setInput("");
    }
    
    return (
        <form onSubmit={submit} className="send-form">
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
    )
}

export  default SendMsg