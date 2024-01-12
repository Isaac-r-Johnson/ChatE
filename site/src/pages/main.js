import React from "react";
import axios from "axios";
import Contact from "../components/Contact";
import Message from "../components/Message";
import ScrollToBottom from 'react-scroll-to-bottom';
import Popup from 'reactjs-popup';
import useSound from 'use-sound'
import notificationSound from '../components/notification.wav';
import User from '../components/User';

const Main  = (props) => {
    const [playSound] = useSound(notificationSound);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [isOnContact, setIsOnContact] = React.useState(false);
    const [usrn, setUsrn] = React.useState("");
    const [pass, setPass] = React.useState("");
    const [profilePic, setProfilePic] = React.useState("");
    const [contacts, setContacts] = React.useState([]);
    const [messages, setMessages] = React.useState({});
    const [unread, setUnread] = React.useState([]);
    const [message, setMessage] = React.useState("");
    const [allUsers, setAllUsers] = React.useState([]);
    const [updatedContacts, setUC] = React.useState(false);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (isOnContact){
                GetMessages(messages.contact);
            }
        }, 3000);
      
        return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isOnContact, messages, unread])
    
      React.useEffect(() => {
        GetAllUsers();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [contacts]);

      React.useEffect(() => {
        if (loggedIn){
            GetThemContacts();
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [updatedContacts]);

    const UpdateFields = (e, field) => {
        if (field === "usrn"){
            setUsrn(e.target.value);
        }
        else if (field === "pass"){
            setPass(e.target.value);
        }
        else if (field === "msg"){
            setMessage(e.target.value);
        }
    }

    const HandleKeyPress = (e) => {
        if(e.key === 'Enter'){
            SendMessage();
        }
    }

    const LoginUser = () => {
        if (usrn !== "" && pass !== ""){
            axios.post(props.apiUrl + "login/", {usrn: usrn, pass: pass})
            .then(res => {
                if (res.data === "-YES-"){
                    setLoggedIn(true);
                    axios.post(props.apiUrl + 'profilepic/', {name: usrn})
                    .then(res => {
                        setProfilePic(res.data);
                    });
                    GetThemContacts();
                }
                else{
                    alert("Username or Password is incorrect!");
                }
            })
            .catch(e => {
                alert("Can not connect to the server at this time. Sorry!"); 
                window.location.reload();
            })
        }
        else{
            alert("Please fill out all fields!")
        }
    }

    const GetThemContacts = () => {
        axios.post(props.apiUrl + 'getcontacts/', {account: usrn})
            .then(res => {
                setContacts(res.data.info);
                setUnread(res.data.unread);
        });
    }

    const SendMessage = () => {
        if (message !== ""){
            axios.post(props.apiUrl + "deleteunread/", {user: usrn, contact: messages.contact})
            .then((res) => {
                axios.post(props.apiUrl + "sendmessage/", {sender: usrn, recv: messages.contact, msg: message})
                .then(res => {
                    console.log(res.data);
                    setMessage("");
                    GetMessages(messages.contact);
                });
            });
        }
    }

    const GetMessages = (contact, isPush=false) => {
        if (isPush){
            axios.post(props.apiUrl + "deleteunread/", {user: usrn, contact: contact})
            .then((res) => {
                console.log(res.data);
                axios.post(props.apiUrl + "getmessages/", {user: usrn, contact: contact})
                .then(res => {
                    if (res.data !== "Error!"){
                        setMessages(res.data);
                        if (res.data.unread.length > unread.length){
                            playSound();
                        }
                        setUnread(res.data.unread);
                        setIsOnContact(true);
                    }
                    else{
                        console.log(res.data);
                    }
                });
            })
        }
        else{
            axios.post(props.apiUrl + "getmessages/", {user: usrn, contact: contact})
            .then(res => {
                if (res.data !== "Error!"){
                    setMessages(res.data);
                    if (res.data.unread.length > unread.length){
                        playSound();
                    }
                    setUnread(res.data.unread);
                    setIsOnContact(true);
                }
                else{
                    console.log(res.data);
                }
            });
        }
    }

    const GetAllUsers = () => {
        var formattedData = [];
        contacts.forEach(contact => {
            formattedData.push(contact.name)
        });
        axios.post(props.apiUrl + "users/", {usrn: usrn, contacts: formattedData}).then(res => {
            setAllUsers(res.data);
        })
    }

    const AddContact = (contactName) => {
        console.log("Add " + contactName + " to contacts!");
        axios.post(props.apiUrl + "addcontact/", {adder: usrn, added: contactName})
        .then(res => {
            if (res.data === "OK"){
                setUC(true);
            }
            else{
                alert("The server is having an error. Sorry for the inconvenience. :(");
            }
        })
    }

    if (loggedIn){
        return (
            <div className="main">

                <div className="contact-ui">
                    <div className="profile">
                        <img src={profilePic} alt='Profile'/>
                        <h4>{usrn}</h4>
                    </div>
                    {contacts.map(contact => (
                        <Contact key={contact.name} unread={unread} customClickEvent={event => GetMessages(contact.name, true)} apiUrl={props.apiUrl} account={usrn} contact={contact.name} image={contact.profilePicture}/>
                    ))}
                    <Popup trigger=
                        {<button className="add-contact">+ Contact</button>}
                        modal nested>
                        {
                            close => (
                                <div className='popup'>
                                    <h2>Add Contacts</h2>
                                    {allUsers.map(user => (
                                        <User key={user.name} customClickEvent={() => {AddContact(user.name); close();}} name={user.name} image={user.profilePicture}/>
                                    ))}
                                </div>
                            )
                        }
                    </Popup>
                </div>
                
                {isOnContact ? (
                    <div className="message-ui">
                        <ScrollToBottom>
                            <div className="messages">
                                {messages.messages.map(message => (
                                    <Message sender={message.sender} content={message.message}/>
                                ))}
                            </div>
                        </ScrollToBottom>
                        <div className="message-box">
                            <input type="text" placeholder="Start Typing..." onChange={event => UpdateFields(event, "msg")} value={message} onKeyDownCapture={HandleKeyPress}/>
                            <button onClick={SendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                                    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ):(
                    null
                )}
            </div>
        );
    }
    else if (!loggedIn){
        return (
            <div className="login-page">
                <div className="login-form">
                    <h1>Login</h1>
                    <div className="form">
                        <div className="input">
                            <p>Username:</p>
                            <input onChange={event => UpdateFields(event, "usrn")} value={usrn} type="text" placeholder='Type your username' name="username"/>
                        </div>
                        <div className="input" style={{'margin-top': '15px'}}>
                            <p>Password:</p>
                            <input onChange={event => UpdateFields(event, "pass")} value={pass} type="password" placeholder="Type your password"  name="password"/>
                        </div>
                        <button onClick={LoginUser}>Login</button>
                        <p>If you don't have an account, please signup <a href="/signup">here</a>!</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;