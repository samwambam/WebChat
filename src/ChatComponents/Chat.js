import { useContext, useEffect, useRef,useState } from "react";
import "../Styles/MainDisplay.css"
import SendMsg from "./SendMsg";
import Message from "./Message"
import {MainContext} from "../Contexts/MainDisplayProvider";

const Chat = () => {
    const scroll = useRef();

    const [msgs, setMsgs] = useState([]);
  //TODO: grab based on selected Chat
    const selectedChat = useContext(MainContext);

  // useEffect(() => {
  //   console.log(chatroom)
  //   const q = query(collection(firestore, "messages"), orderBy("timestamp"))
  //   const unsubscribe = onSnapshot(q, (querySnapshot) => {
  //     let messages = []
  //     querySnapshot.forEach((doc) => {
  //       //console.log("doc", doc)
  //       messages.push({...doc.data(), id: doc.id});
  //     })
  //     setMsgs(messages);
  //   })
  //   return () => unsubscribe;
  // }, []);

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