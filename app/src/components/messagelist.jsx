import React, { useState, useEffect, useRef } from "react";
import Message from "./message";

function MessageList(props) {
  const list = props.messageList.map((messageValue) => {
    return (
      <Message
        onDeleteItem={props.onDeleteItem}
        type={messageValue.type}
        key={messageValue.id}
        id={messageValue.id}
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
      <table style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td>
              <ul>{list}</ul>
            </td>
          </tr>
          <tr>
            <td>
              <div ref={messagesEndRef} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MessageList;
