import { useState } from "react";
import {auth} from "./backend/firebase"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile} from "firebase/auth";
import "./Styles/Auth.css"

function AuthPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const submitsignup = async (e) => {
      e.preventDefault();

      if (pass === confirmPass) {
        const res = await createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          updateProfile(user, {
            displayName: username
          })
          .then(() => {
            console.log("Profile updated")
            // Profile updated!
            // ...
          })
          .catch((error) => {
            console.log(error)
            // An error occurred
            // ...
          });
          console.log(user)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
      }else{
        return
      }
      
    }

    const submitsignin = async (e) => {
      e.preventDefault();
      const res = await signInWithEmailAndPassword(auth, email, pass)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    }
  
    //sign up and login: https://codepen.io/mamislimen/pen/jOwwLvy
    return (
      <div className="main">
        <input type="checkbox" id="chk" aria-hidden="true"/>

        <div className="signup">
            <form>
              <label htmlFor="chk" aria-hidden="true" className="authlabel"> Sign Up </label>
              <input type="text" name="user" placeholder="User name" 
              onChange= {(e) => setUsername(e.target.value)}
              />
              <input type="email" name="email" placeholder="Email" 
              onChange= {(e) => setEmail(e.target.value)}
              />
              <input type="password" name="pswd" placeholder="Password" 
              onChange= {(e) => setPass(e.target.value)}
              />
              <input type="password" name="pswd" placeholder="Confirm password" 
              onChange= {(e) => setConfirmPass(e.target.value)}
              />
              <button type="submit" className="authbtn" onClick={submitsignup}> Sign up </button>
            </form>
        </div>

        <div className="login">
          <form>
            <label htmlFor="chk" aria-hidden="true" className="authlabel"> Log in </label>
            <div className="logininputs">
              <input type="email" name="loginemail" placeholder="Email"
              onChange= {(e) => setEmail(e.target.value)}
              />
              <input type="password" name="loginpswd" placeholder="Password"
              onChange= {(e) => setPass(e.target.value)}
              />
              <button type="submit" className="authbtn" onClick={submitsignin}> Log in</button>
            </div>
          </form>
        </div>
      </div>
      
    );
  }
  
  export default AuthPage;