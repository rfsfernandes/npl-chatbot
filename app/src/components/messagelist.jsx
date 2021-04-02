import React, { useState } from "react";
import Message from "./message";

function MessageList(props) {
    
  const list = props.messageList.map((messageValue) => {
    return <Message key={messageValue.id} messageText={messageValue.messageText}/>;
  });

  return (
    <div className="messageList">
      <ul>
        {list}
      </ul>
    </div>
  );
}

export default MessageList;
