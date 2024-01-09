import React from 'react';

const Contact = (props) => {
    console.log(props.unread)
    var Unread = false;
    props.unread.forEach(name => {
        if (name === props.contact){
            Unread = true;
        }
    });
    return (
            <div className="contact" onClick={props.customClickEvent}>
                <img src={props.image} alt='Profile'/>
                <h6>{props.contact}</h6>
                {Unread ? (
                    <div className='unread'></div>
                ):(null)}
            </div>
    );
}

export default Contact