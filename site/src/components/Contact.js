import React from 'react';

const Contact = (props) => {
    return (
            <div className="contact">
                <img src={props.image} alt='Profile'/>
                <h6>{props.name}</h6>
                <p>{props.time}</p>
            </div>
    );
}

export default Contact