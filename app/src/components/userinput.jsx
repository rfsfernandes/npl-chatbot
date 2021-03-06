import React from "react";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import SendRoundedIcon from "@material-ui/icons/SendRounded";

function UserInput(props) {
  return (
    <div className="user-input">
      <form item className="input-form" onSubmit={props.onSubmit}>
        <Grid
          className="grid-container"
          container
          alignItems="center"
          justify="center"
        >
          <Grid item xl={11} md={9} lg={11} sm={9} xs={8}>
            <TextField
              className="chat-input"
              id="outlined-multiline-static"
              label="Pergunta-me algo"
              rows={1}
              variant="outlined"
              name="text"
              value={props.inputValue}
              onChange={props.onChangeEvent}
            />
          </Grid>
          <Grid item xl={1} md={3} lg={1} sm={3} xs={4}>
            <Grid container alignItems="center" justify="center">
              <IconButton aria-label="send" type="submit"  >
                <SendRoundedIcon id="icon-send" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default UserInput;
