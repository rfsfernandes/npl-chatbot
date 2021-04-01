import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

function UserInput(props) {
  return (
    <div className="user-input">
      <form onSubmit={props.onSubmit}>
        <TextField
          id="outlined-multiline-static"
          label="Envia a tua mensagem..."
          multiline
          rows={4}
          variant="outlined"
          name="text"
          value={props.inputValue}
          onChange={props.onChangeEvent}
        />
        <Button type="submit" color="primary" >Primary</Button>
      </form>
    </div>
  );
}

export default UserInput;
