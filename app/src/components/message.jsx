import React from 'react';

function Message(props) {
    return (
      <li key={props.key} className="message">
        {props.messageText}
      </li>
    );
  }
  
  export default Message;