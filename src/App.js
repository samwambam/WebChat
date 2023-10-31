import './App.css';
import { useEffect, useState } from 'react';
import { onAuthStateChanged} from "firebase/auth";
import MainDisplay from "./MainDisplay"
import AuthPage from './AuthPage';
import {auth} from "./backend/firebase";

function App() {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) =>{
      setCurrentUser(user);
    });

    return () => {
      unsub();
    }
  }, [])

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