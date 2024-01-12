import React from 'react';

const User = (props) => {
    return (
            <div className="contact" onClick={props.customClickEvent}>
                <img src={props.image} alt='Profile'/>
                <h6>{props.name}</h6>
            </div>
    );
}

export default User;