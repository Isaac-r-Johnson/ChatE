import React from 'react';
import axios from 'axios';

const Contact = (props) => {

    // const GetContactInfo = () => {
    //     axios.post(props.apiUrl + "selectcontactinfo/", {account: props.account, contact: props.contact})
    //     .then(res => {
    //         if (res.data === "-NO-"){
    //             alert("Are server is having trouble sending data.")
    //         }
    //         else{
    //             props.customClickEvent();
    //         }
    //     })
    //     .catch(e => alert("You are having trouble connecting to our server."));
    // }

    return (
            <div className="contact" onClick={props.customClickEvent}>
                <img src={props.image} alt='Profile'/>
                <h6>{props.contact}</h6>
            </div>
    );
}

export default Contact