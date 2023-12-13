import { useContext, useEffect, useRef,useState } from "react";
import "../Styles/MainDisplay.css"
import SendMsg from "./SendMsg";
import Message from "./Message"
import {MainContext} from "../Contexts/MainDisplayProvider";
import { firestore } from "../backend/firebase";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";

const Chat = () => {
    const scroll = useRef();

    const [msgs, setMsgs] = useState([]);
  //TODO: grab based on selected Chat
    const selectedChat = useContext(MainContext);

  useEffect(() => {
    console.log(selectedChat);
    if (selectedChat) {
      const docRef = doc(firestore, "chats", selectedChat);
      const colRef = collection(docRef, "messages");
      const q = query(colRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messages = []
        querySnapshot.forEach((doc) => {
          //console.log("doc", doc)
          messages.push({ ...doc.data(), id: doc.id });
        })
        setMsgs(messages);
      })
      return () => unsubscribe;
    }
  }, [selectedChat]);

    return (
      <div className="chat-content">
        <div className="messages">
          {msgs.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>

        <div className="send-component">
          <SendMsg scroll={scroll} />
        <span ref={scroll}></span>
        </div>
      </div>
    );
}

export default Chat;