import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreButton from "./morebutton";

function Message(props) {
  const [isShown, setIsShown] = useState(false);

  return (
    <li
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      key={props.id}
      style={{ width: "100%" }}
    >
      <div style={{ width: "100%" }}>
        <div
          className={
            props.type == 0
              ? "bot-message-container"
              : "human-message-container"
          }
        >
          {props.type == 1 && isShown? <MoreButton id={props.id} onDeleteItem={props.onDeleteItem}/> : ""}

          <p className={props.type == 0 ? "bot-message" : "human-message"}>
            {props.messageText}
          </p>

          {props.type == 0 && isShown ? <MoreButton id={props.id} onDeleteItem={props.onDeleteItem}/> : ""}
        </div>
      </div>
    </li>
  );
}

export default Message;
