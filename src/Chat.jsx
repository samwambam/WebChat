import React, {useState, useEffect, useRef} from "react";
import {query, collection, orderBy, onSnapshot} from "firebase/firestore"
import Message from "./ChatComponents/Message"
import {firestore} from "./backend/firebase"
import SendMsg from "./ChatComponents/SendMsg";
import Sidebar from './Sidebar';
import "./Styles/Chat.css"

const Chat = () => {
  const [msgs, setMsgs] = useState([]);
  const scroll = useRef()

  useEffect(() => {
    const q = query(collection(firestore, "messages"), orderBy("timestamp"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages = []
      querySnapshot.forEach((doc) => {
        //console.log("doc", doc)
        messages.push({...doc.data(), id: doc.id});
      })
      setMsgs(messages);
    })
    return () => unsubscribe;
  }, [])

  return (
    <div className="whole">
      <div className="sidebar">
        <Sidebar/>
      </div>

      <div className="chats">
        {msgs.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        
        <SendMsg scroll={scroll} />
        <span ref={scroll}></span>
      </div>
    </div>
  );
};
export default Chat;

/**
 * 
 */