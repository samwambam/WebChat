import React, { useEffect } from "react"
import "../Styles/MainDisplay.css"

const Message = ({ message }) => {
    const pic = "https://th.bing.com/th/id/R.13297c89cfd9de9c95b792e6ad3a472c?rik=9YepHxy83p90Fg&riu=http%3a%2f%2fanimalsbreeds.com%2fwp-content%2fuploads%2f2014%2f07%2fBeagle.jpg&ehk=FZ9ni0LO81qRkqWKRmcIDB8txM1XCgoFE9%2bJlBnkaGo%3d&risl=&pid=ImgRaw&r=0"

    return (
        <div className="message">
            <div 
                className="user-pic" style= {{backgroundImage: `url(${pic})`}}> </div>
            <div className="content"> 
                <p className="user-name"> {message.sender} </p>
                <p className=""> {message.text} </p>
            </div>
        </div>
    )
}

export  default Message
