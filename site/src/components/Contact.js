import React from 'react';

const Contact = (props) => {
    var unread = false;
    props.unread.forEach(name => {
        if (name === props.contact){
            unread = true;
        }
    });
    return (
            <div className="contact" onClick={props.customClickEvent}>
                <img src={props.image} alt='Profile'/>
                <h6>{props.contact}</h6>
                {unread ? (
                    <div className='unread'></div>
                ):(null)}
            </div>
    );
}

export default Contact;