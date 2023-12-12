import { useContext, useEffect, useState } from "react";
import { MainDispatchContext } from "../Contexts/MainDisplayProvider";
import { auth, firestore } from "../backend/firebase";
import { collection, query, doc, where, getDoc, getDocs, updateDoc, addDoc, deleteField, onSnapshot } from "firebase/firestore";
import "../Styles/Sidebar.css";


//TODO: CSS 

const AddFriendComponent = () => {
    const [friendEmail, setFriendEmail] = useState("");
    const [requests, setRequests] = useState([]);
    
    useEffect(() => {
        const user = auth.currentUser;
        const fetchDoc = async () => {
            try {
                const unsub = onSnapshot(doc(firestore, "users", user.uid), (qSnapshot) => {
                    if (qSnapshot.exists()) {
                        const dictionary = qSnapshot.data().friendRequestsReceived;
                        
                        if (dictionary) {
                            const arr = [];
                            Object.keys(dictionary).map((key) => {
                                arr.push({ key: key, name: dictionary[key] });
                            })
                            setRequests(arr);
                        }
                    } else {
                        console.log("Current user not found");
                    }
                })
                return () => unsub;
            } catch (error) {
                console.error(error);
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

    const acceptRequest = async (e, friendId, friendName) => {
        console.log(e);
        const user = auth.currentUser;
        const userRef = doc(firestore, "users", user.uid);
        const friendRef = doc(firestore, "users", friendId);

        try {
            //update current user
            await updateDoc(userRef, {
                [`friends.${friendId}`]: friendName,
                [`friendRequestsReceived.${friendId}`]: deleteField()
            });

            //update friend
            await updateDoc(friendRef, {
                [`friends.${user.uid}`]: friendName,
                [`friendRequestsSent.${user.uid}`]: deleteField()
            });
        } catch (error) {
            //error querying and updating
            console.error(error);
        }
    }

    const rejectRequest = async (e, friendId) => {
        console.log(e);
        const user = auth.currentUser;
        const userRef = doc(firestore, "users", user.uid);
        const friendRef = doc(firestore, "users", friendId);

        try {
            //update current user
            await updateDoc(userRef, {
                [`friendRequestsReceived.${friendId}`]: deleteField()
            });

            //update friend
            await updateDoc(friendRef, {
                [`friendRequestsSent.${user.uid}`]: deleteField()
            });
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
            <div className="friend-requests">
            <h2> Friend Requests</h2>
            <ul>
                {requests.map((request) => (
                    <li key={request.key}>
                        <span>{request.name}</span>
                        <div>
                            <button className="accept-btn" onClick={e => acceptRequest(e, request.key, request.name)}> Accept </button>
                            <button className="reject-btn" onClick={e => rejectRequest(e, request.key)}> Ignore </button>
                        </div>
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
                const q = query(collection(firestore,"chats"), where(`participants.${user.uid}`, ">=", ""));
                const chatsQuerySnapshot = await getDocs(q);
                if (!chatsQuerySnapshot.empty && user) {
                    const arr = [];
                    chatsQuerySnapshot.docs.forEach((v) => {
                        const data = {...v.data(), id: v.id} ;
                        arr.push(data);
                    });
                    setChats(arr);
                    console.log(arr);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchChats();
    }, [])

    const setChat = (e) => {
        e.preventDefault();
        setSelectedChat(e.target.id);
    }

    return (
        <div className="chat-list-div">
            <ul>
                {chats.map((chat) => (
                    <li key={chat.id} id= {chat.id} onClick={setChat} className="list">
                        {chat.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}


const MakeNewGroupChatComponent = () => {
    const [friends, setFriends] = useState({});
    const [selected, setSelected] = useState({});

    useEffect(() => {
        const user = auth.currentUser;
        setSelected({[user.uid]: user.displayName});

        const fetchFriends = async () => {
            try {
                const docSnapshot = await getDoc(doc(firestore, "users", user.uid));
                if (docSnapshot.exists()) {
                    const friendsList = docSnapshot.data().friends;

                    if (friendsList) {
                        setFriends(friendsList);
                    }else{
                        //no friends yet
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchFriends();
    }, [])

    const addToChat = (e) => {
        const id = e.target.id;
        if (!Object.hasOwn(selected, id)) {
            setSelected({...selected, [id]: friends[id]});
        } else {
            const newSelected = { ...selected };
            // Using delete operator to remove 'city' property
            delete newSelected[id];
            setSelected(newSelected);
        }
    }

    const createGroupChat = async () => {
        var groupName = "";
        if (Object.entries(selected).length === 1) {
            groupName = Object.values(selected)[0];
        } else {
            const valuesofObject = Object.values(selected);
            for (let i = 0; i < 4; i++) {
                groupName += valuesofObject[i];
            }
        }

        if (selected.length >= 1){
            try {
                const docRef = await addDoc(collection(firestore, "chats"), {
                    groupName: groupName,
                    participants: selected
                });
            } catch (error) {
                console.error(error);
            }
        }else{
            //TO DO: error message
        }
    }

    //TODO: key
    return (
        <div className="new-chat-div">
            <h2> Create new group chat</h2>
            <button onClick={createGroupChat}> Create </button>
            <ul>
                {
                    Object.keys(friends).map((friendKey) => (
                        <li key={friendKey} id={friendKey} onClick={addToChat} className="list">
                            {friends[friendKey]} {Object.hasOwn(selected, friendKey) ? "(Selected)" : ""}
                        </li>
                    ))
                }
            </ul>
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
            setShowAddFriends(!showAddFriends);
            setShowChats(false);
            setShowMakeNewChat(false);
        }else if (e.target.name === "chats"){
            setShowChats(!showChats);
            setShowAddFriends(false);
            setShowMakeNewChat(false);
        }else if (e.target.name === "newchat"){
            setShowMakeNewChat(!showMakeNewChat);
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
                {showAddFriends && <AddFriendComponent />}
                {showChats && <ChatListComponent />}
                {showMakeNewChat && <MakeNewGroupChatComponent />}
            </div>
            
        </div>
    )
}

export default Sidebar;