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
          <table style={ props.type == 1 ? {float: "right"} : {}}>
            <tbody>
              <tr>
                {props.type == 1 && isShown ? (
                  <MoreButton id={props.id} isDefault={props.isDefault} onDeleteItem={props.onDeleteItem} />
                ) : (
                  <td style={{width: "48px", height: "48px"}}></td>
                )}

                <td>
                  <p
                    className={
                      props.type == 0 ? "bot-message" : "human-message"
                    }
                  >
                    {props.messageText}
                  </p>
                </td>

                {props.type == 0 && isShown ? (
                  <MoreButton id={props.id} isDefault={props.isDefault} onDeleteItem={props.onDeleteItem} onTeachItem={props.onTeachItem} />
                ) : (
                  <td style={{width: "48px", height: "48px"}}></td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </li>
  );
}

export default Message;
