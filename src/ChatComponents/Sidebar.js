import { useContext, useEffect, useState } from "react";
import { MainDispatchContext } from "../Contexts/MainDisplayProvider";
import { auth, firestore } from "../backend/firebase";
import { collection, query, doc, where, getDoc, getDocs, updateDoc, addDoc } from "firebase/firestore";

//TODO: CSS 

const AddFriendComponent = () => {
    const [friendEmail, setFriendEmail] = useState("");
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const user = auth.currentUser;
        const fetchDoc = async () => {
            try {
                const docSnapshot = await getDoc(doc(firestore, "users", user.uid));
                if (docSnapshot.exists()) {
                    const dictionary = docSnapshot.data().friendRequestsReceived

                    if (dictionary) {
                        const arr = [];
                        Object.keys(dictionary).map((key) => {
                            arr.push({ key: key, name: dictionary[key] })
                        })
                        setRequests(arr);
                    }
                } else {
                    console.log("Current user not found")
                }
            } catch (error) {
                console.error(error)
            }
        }

        fetchDoc();
    }, [])

    const handleAddFriend = async (e) => {
        const usersRef = collection(firestore, "users");
        const user = auth.currentUser;

        try {
            const friendQuerySnapshot = await getDocs(query(usersRef, where("email", "==", friendEmail)));

            if (!friendQuerySnapshot.empty && user) {
                const friendDoc = friendQuerySnapshot.docs[0];

                //TODO: check if already added
                //add sent request
                await updateDoc(doc(firestore, "users", user.uid), {
                    [`friendRequestsSent.${friendDoc.id}`]: friendDoc.data().username
                });

                //add received request
                await updateDoc(doc(firestore, "users", friendDoc.id), {
                    [`friendRequestsReceived.${user.uid}`]: user.displayName
                });
            } else {
                //no email
                console.log("Couldn't find email");
            }

        } catch (error) {
            //error querying and updating
            console.error(error);
        }
    }

    return (
        <div>
            <div className="add-friend-div">
                <h2> Add Friends </h2>
                <input type="email" placeholder="Enter friend's email" onChange={(e) => setFriendEmail(e.target.value)} />
                <button onClick={handleAddFriend}> Send Friend Request </button>
            </div>
            <div>
            <h2> Friend Requests</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request.key}>
                        <span> Friend request from {request.name}</span>
                        <button> Accept </button>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    )
}

const ChatListComponent = () => {
    const setSelectedChat = useContext(MainDispatchContext);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            const user = auth.currentUser;
            try {
                const chatsQuerySnapshot = await getDocs(query(collection(firestore,"chats")));
                if (!chatsQuerySnapshot.empty && user) {
                    const arr = [];
                    chatsQuerySnapshot.docs.forEach((v) => {
                        arr.push(v);
                    });
                    setChats(arr);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchChats();
    }, [])

    const setChat = (e) => {
        e.preventDefault();
        
    }

    return (
        <div className="chat-list-div">
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id} onClick={setChat}>
                        {chat.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}


const MakeNewGroupChatComponent = () => {
    const [friends, setFriends] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        const fetchFriends = async () => {
            const user = auth.currentUser;
            try {
                const docSnapshot = await getDoc(doc(firestore, "users", user.uid));
                if (docSnapshot.exists()) {
                    const friendsList = docSnapshot.data().friends;
                    const arr = [];
                    if (friendsList) {
                        friendsList.forEach((i) => {
                            arr.push(i);
                        });
                        setFriends(arr);
                    } else {
                        //no friends yet
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchFriends();
    }, [])

    const addToChat = (friend) => {
        if (!selected.includes(friend)) {
            setSelected([...selected, friend]);
        } else {
            setSelected(selected.filter(u => u !== friend));
        }
    }

    const createGroupChat = async () => {
        var groupName = "";
        if (selected.length === 1) {
            groupName = selected[0];
        } else {
            selected.forEach((i) => (
                groupName += (i + " ")
            ));
        }

        try {
            const docRef = await addDoc(collection(firestore, "chats"), {
                groupName: groupName,
                participants: selected
            });
        } catch (error) {
            console.error(error);
        }
    }
    //TODO: key
    return (
        <div className="new-chat-div">
            <h2> Create new group chat</h2>
            <ul>
                {friends.map((friend) => (
                    <li key={friend} onClick={addToChat}>
                        {friend} {selected.includes(friend) ? "(Selected)" : ""}
                    </li>
                ))}
            </ul>
            <button onClick={createGroupChat}> Create </button>
        </div>
    )
}

const Sidebar = () => {
    const [showAddFriends, setShowAddFriends] = useState(false);
    const [showChats, setShowChats] = useState(false);
    const [showMakeNewChat, setShowMakeNewChat] = useState(false);

    // const signout = () => {
    //     signOut(auth).then(() => {
    //         // Sign-out successful.
    //       }).catch((error) => {
    //         // An error happened.
    //       });
    // }

    const toggleButtonClick = (e) => {
        e.preventDefault();

        if (e.target.name === "friends") {
            setShowAddFriends(true);
            setShowChats(false);
            setShowMakeNewChat(false);
        }else if (e.target.name === "chats"){
            setShowChats(true);
            setShowAddFriends(false);
            setShowMakeNewChat(false);
        }else if (e.target.name === "newchat"){
            setShowMakeNewChat(true);
            setShowAddFriends(false);
            setShowChats(false);
        }
        
    }

    return (
        <div className="sidebar-whole">
            <div className="narrow">
                <ul>
                    <li> <button type="button" name="friends" onClick={toggleButtonClick}> Add friends </button> </li>
                    <li> <button type="button" name="chats" onClick={toggleButtonClick}> Chats </button> </li>
                    <li> <button type="button" name="newchat" onClick={toggleButtonClick}> New Chat </button> </li>
                </ul>
            </div>
            <div className="sidebar-main">
                { showAddFriends && <AddFriendComponent/> }
                { showChats && <ChatListComponent/> }
                { showMakeNewChat && <MakeNewGroupChatComponent /> }
            </div>
            
        </div>
    )
}

export default Sidebar;