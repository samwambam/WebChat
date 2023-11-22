import './App.css';
import { useEffect, useState } from 'react';
import { onAuthStateChanged} from "firebase/auth";
import MainDisplay from "./MainDisplay"
import AuthPage from './AuthPage';
import {auth, firestore} from "./backend/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

function App() {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) =>{
      setCurrentUser(user);
      if (user) {
        await createUserDocument(user);
      }
    });

    return () => {
      unsub();
    }
  }, [])

  const createUserDocument = async (user) => {
    const userRef = doc(firestore, "users", user.uid);
    
    try{
      const doc = await getDoc(userRef);

      if (!doc.exists()){
        await setDoc(userRef, {
          username: user.displayName,
          email: user.email
        })
        console.log("Created");
      }
    }catch(error) {
      console.error("Couldn't create document", error);
    }
  }

  return (
    <section>
      {currentUser ? <MainDisplay user={currentUser}/> : <AuthPage/>}
    </section>
      
  );
}

export default App;

/**
 * 
 */