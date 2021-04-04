/* import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

function MoreButton(props) {

	const handleClick = (popupState) => {
		console.log(popupState);
		popupState.close();
	}

  return (
    <PopupState  variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment	>
          <IconButton {...bindTrigger(popupState)}>
            <MoreVertIcon className="hidden"/>
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={() => handleClick(popupState)}>Apagar</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

export default MoreButton; */

import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";

function MoreButton(props) {
  const popupState = usePopupState({ variant: "popover", popupId: "demoMenu" });

  const handleClickDelete = (popupState, id) => {
    console.log(popupState);
    popupState.close();
		props.onDeleteItem(id);
  };

  const handleClickTeach = (popupState) => {
    console.log(popupState);
    popupState.close();
		props.onTeachItem();
  };

  return (
    <td>
      <IconButton variant="contained" {...bindTrigger(popupState)}>
        <MoreVertIcon className="hidden" />
      </IconButton>
      <Menu {...bindMenu(popupState)}>
        <MenuItem onClick={() => handleClickDelete(popupState, props.id)}>Apagar</MenuItem>
        {props.isDefault ? <MenuItem onClick={() => handleClickTeach(popupState)}>Ensinar</MenuItem> : ""}
      </Menu>
    </td>
  );
}

export default MoreButton;
