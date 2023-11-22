import { useContext } from "react";
import {MainDispatchContext} from "../Contexts/MainDisplayProvider";

const Sidebar = () => {
    const setUserDetails = useContext(MainDispatchContext);

    // const signout = () => {
    //     signOut(auth).then(() => {
    //         // Sign-out successful.
    //       }).catch((error) => {
    //         // An error happened.
    //       });
    // }

    const handleClick = (e) => {
        e.preventDefault();
        setUserDetails("Hey");
    }

 return (
    <div>
        <p> Sidebar </p>
    </div>
 );
}

export default Sidebar;