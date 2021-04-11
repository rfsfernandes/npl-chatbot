import React, { useState } from "react";
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
            props.type === 0
              ? "bot-message-container"
              : "human-message-container"
          }
        >
          <table style={ props.type === 1 ? {float: "right"} : {}}>
            <tbody>
              <tr>
              {props.type === 1 && isShown ? (
                  <MoreButton
                    id={props.id}
                    isDefault={props.isDefault}
                    onDeleteItem={props.onDeleteItem}
                  />
                ) : props.type === 0 ? (
                  ""
                ) : (
                  <td style={{ width: "48px", height: "48px" }}></td>
                )}

                <td>
                  <p
                    className={
                      props.type === 0 ? "bot-message" : "human-message"
                    }
                  >
                    {props.messageText}
                  </p>
                </td>

                {props.type === 0 && isShown ? (
                  <MoreButton id={props.id} isDefault={props.isDefault} onDeleteItem={props.onDeleteItem} onTeachItem={props.onTeachItem} />
                ) : props.type === 1 ? (
                  ""
                ) : (
                  <td style={{ width: "48px", height: "48px" }}></td>
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
