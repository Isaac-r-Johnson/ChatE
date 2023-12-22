import React from "react";
import axios from "axios";

const Main  = (props) => {

    const [loggedIn, setLoggedIn] = React.useState(false);
    const [usrn, setUsrn] = React.useState("");
    const [pass, setPass] = React.useState("");



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
                }
                else{
                    alert("Username or Password is incorrect!");
                }
            })
        }
    }


    if (loggedIn){
        return (
            <div>
                <h1>Main Page</h1>
            </div>
        );
    }
    else if (!loggedIn){
        return (
            <div className="login-page">
                <div className="login-form">
                    <h1>Login</h1>
                    <div className="form">
                        <input onChange={event => UpdateFields(event, "usrn")} value={usrn} type="text" placeholder="Username" name="username"/>
                        <input onChange={event => UpdateFields(event, "pass")} value={pass} type="password" placeholder="Password"  name="password"/>
                        <button onClick={LoginUser}>Login</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;