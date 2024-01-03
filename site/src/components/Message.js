import React from "react";

const Message = (props) => {
    return (
        <div className={props.sender}>
            <h6>{props.content}</h6>
        </div>
    );
}

export default Message;