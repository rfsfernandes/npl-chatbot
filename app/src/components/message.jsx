import React from "react";

function Message(props) {
  return (
    <li key={props.key} style={{ width: "100%" }}>
      <div style={{ width: "100%" }}>
        <div
          className={props.type == 0 ? "bot-message-container" : "human-message-container"}
        >
          <p className={props.type == 0 ? "bot-message" : "human-message"}>{props.messageText}</p>
        </div>
      </div>
    </li>
  );
}

export default Message;
