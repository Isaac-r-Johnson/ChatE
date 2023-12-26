import React from "react";
import axios from "axios";
import Contact from "../components/Contact";
import Message from "../components/Message";

const Main  = (props) => {

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [usrn, setUsrn] = React.useState("");
    const [pass, setPass] = React.useState("");
    const [profilePic, setProfilePic] = React.useState("");
    const [contacts, setContacts] = React.useState([]);
    const [messageThread, setMessageThread] = React.useState({});
    

    const UpdateFields = (e, field) => {
        if (field === "usrn"){
            setUsrn(e.target.value);
        }
        else if (field === "pass"){
            setPass(e.target.value);
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
                    axios.post(props.apiUrl + 'getcontacts/', {account: usrn})
                    .then(res => {
                        setContacts(res.data);
                    });
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

    const GetMessageThread = () => {
        axios.get(props.apiUrl + "messagethread/")
        .then(res => {
            setMessageThread(res.data);
        });
    }

    const AddContact = () => {
        console.log("Add Contact!");
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
                        <Contact customClickEvent={GetMessageThread} apiUrl={props.apiUrl} account={usrn} contact={contact.name} image={contact.profilePicture} date={contact.date}/>
                    ))}
                    <button onClick={AddContact} className="add-contact">+ Contact</button>
                </div>

                <div className="message-ui">
                    <h1>Messages</h1>
                </div>

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