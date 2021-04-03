import React, { useState, useEffect, useRef } from "react";
import Message from "./message";

function MessageList(props) {
  const list = props.messageList.map((messageValue) => {
    return (
      <Message
        type={messageValue.type}
        key={messageValue.id}
        messageText={messageValue.messageText}
      />
    );
  });

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [props.messageList]);

  return (
    <div className="messageList">
      <table style={{width: "100%"}}>
        <tr>
          <ul>{list}</ul>
        </tr>
        <tr>
          <div ref={messagesEndRef}/>
        </tr>
      </table>
    </div>
  );
}

export default MessageList;
