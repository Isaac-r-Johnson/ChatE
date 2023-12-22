import axios from "axios";
import React from "react";

const Signup  = (props) => {
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

    const SendNewUser = () => {
        if (usrn !== "" && pass !== ""){
            axios.post(props.apiUrl + "signup/", {usrn: usrn, pass: pass})
            .then(res => {
                if (res.data === "OK"){
                    window.location.href = props.siteUrl + "main/";
                }
                else{
                    alert("Error!");
                }
            })
        }
    }

    return (
        <div className="login-page">
            <div className="login-form">
                <h1>SignUp</h1>
                <div className="form">
                    <input onChange={event => UpdateFields(event, "usrn")} value={usrn} type="text" placeholder="Username" name="username"/>
                    <input onChange={event => UpdateFields(event, "pass")} value={pass} type="password" placeholder="Password"  name="password"/>
                    <button onClick={SendNewUser}>SignUp</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;