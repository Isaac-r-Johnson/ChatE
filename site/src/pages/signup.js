import axios from "axios";
import React from "react";

const Signup  = (props) => {
    const [usrn, setUsrn] = React.useState("");
    const [pass, setPass] = React.useState("");
    const [pic, setPic] = React.useState("");


    const UpdateFields = (e, field) => {
        if (field === "usrn"){
            setUsrn(e.target.value);
        }
        else if (field === "pass"){
            setPass(e.target.value);
        }
        else if (field === "pic"){
            setPic(e.target.value);
        }
    }

    const SendNewUser = () => {
        if (usrn !== "" && pass !== ""){
            axios.post(props.apiUrl + "signup/", {usrn: usrn, pass: pass, pic: pic})
            .then(res => {
                if (res.data === "OK"){
                    window.location.href = props.siteUrl;
                }
                else{
                    alert("Error!");
                }
            })
            .catch(e => {alert("Can't connect to server right now. Please try again later."); window.location.reload()});
        }
        else{
            alert("Please fill out all fields!")
        }
    }

    return (
        <div className="login-page signup">
            <div className="login-form sf">
                <h1>SignUp</h1>
                <div className="form">
                        <div className="input">
                            <p>Username:</p>
                            <input onChange={event => UpdateFields(event, "usrn")} value={usrn} type="text" placeholder='Type your username' name="username"/>
                        </div>
                        <div className="input" style={{'margin-top': '15px'}}>
                            <p>Password:</p>
                            <input onChange={event => UpdateFields(event, "pass")} value={pass} type="password" placeholder="Type your password"  name="password"/>
                        </div>
                        <div className="input" style={{'margin-top': '15px'}}>
                            <p>Picture:</p>
                            <input onChange={event => UpdateFields(event, "pic")} value={pic} type="text" placeholder="Enter link to your picture"  name="pic"/>
                        </div>
                        <button className='signup-btn' onClick={SendNewUser}>SignUp</button>
                    </div>
            </div>
        </div>
    );
}

export default Signup;