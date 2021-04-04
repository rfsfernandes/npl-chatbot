import React, { useState, useEffect } from "react";
import MessageList from "./messagelist";
import UserInput from "./userinput";
import Card from "@material-ui/core/Card";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

const axios = require("axios").default;
const INITIAL_STATE = [
  {
    id: 0,
    messageText: "Olá! Eu sou o Asdrubal",
    type: 0,
    isDefault: false,
  },
];

const FORM_INITIAL_STATE = {
  text: "",
  question: "",
  answer: ""
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #FFFFFF",
    borderRadius: "8px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modalTitle: {
    textAlign: "center",
    marginBottom: "24px",
  },
  buttonCancel: {
    margin: "10% auto auto auto", 
    width: "100%",
    color: "#717070",
    height: "40px"
  },
  buttonConfirm: {
    margin: "10% auto auto auto", 
    width: "100%",
    backgroundColor: "#fe893b !important",
    borderRadius: "10px",
    height: "40px"
  }
}));

function Body() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [messageList, setMessageList] = useState(INITIAL_STATE);
  const [formFields, setFormFields] = useState(FORM_INITIAL_STATE);
  const [messageId, setMessageId] = useState(0);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const postQuestion = (event) => {
    event.preventDefault();
    if (formFields.text) {
      let tempMessageIdUser = messageId + 1;
      setMessageList((previous) => [
        ...previous,
        {
          id: tempMessageIdUser,
          messageText: formFields.text,
          type: 1,
          isDefault: false,
        },
      ]);

      axios
        .post("http://localhost:3001/api/sendQuestion", {
          question: formFields.text,
        })
        .then(function (response) {
          // console.log(response);
          let tempMessageIdBot = tempMessageIdUser + 1;
          setMessageList((previous) => [
            ...previous,
            {
              id: tempMessageIdBot,
              messageText: response.data.answer,
              type: 0,
              isDefault: response.data.isDefault,
            },
          ]);
          setMessageId(tempMessageIdBot);
        })
        .catch(function (error) {
          console.log(error);
        });

      setFormFields(() => ({
        text: "",
      }));
    }
  };

  const onDeleteItem = (id) => {
    setMessageList(messageList.filter((item) => item.id !== id));
    console.log(messageList);
  };

  const onTeachItem = () => {
    handleOpen();
  };

  const teachAsdrubal = (event) => {
    event.preventDefault();
    handleClose();
    console.log(event.target);
    axios
        .post("http://localhost:3001/api/teachBot", {
          question: formFields.question,
          answer: formFields.answer
        })
        .then(function (response) {
          // console.log(response);
          let tempMessageIdBot = messageId + 1;
          setMessageList((previous) => [
            ...previous,
            {
              id: tempMessageIdBot,
              messageText: response.data.answer,
              type: 0,
              isDefault: response.data.isDefault,
            },
          ]);
          setMessageId(tempMessageIdBot);
        })
        .catch(function (error) {
          console.log(error);
        });
  };

  const cancelHandler = () => {  
    handleClose();
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
   
    setFormFields((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  return (
    <div className="body" style={{maxHeight: "66.6vh", minHeight: "66.6vh"}}>
      <Card className="message-container" elevation={10}>
        <MessageList
          onTeachItem={onTeachItem}
          onDeleteItem={onDeleteItem}
          messageList={messageList}
        />
        <UserInput
          inputValue={formFields.text}
          onChangeEvent={handleFieldChange}
          onSubmit={postQuestion}
        />
      </Card>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper} style={{ backgroundColor: "#FFFFFF" }}>
            <form onSubmit={teachAsdrubal}>
              <h3 className={classes.modalTitle}>Ensina o Asdrubal!</h3>
              <TextField
                className="chat-input"
                id="outlined-multiline-static"
                label="A tua pergunta"
                rows={1}
                variant="outlined"
                name="question"
                onChange={handleFieldChange}
              />

              <TextField
                style={{ marginTop: "4%" }}
                className="chat-input"
                label="A resposta do Asdrubal"
                rows={1}
                variant="outlined"
                name="answer"
                onChange={handleFieldChange}
              />
              <Grid container alignItems="center" justify="center">
                <Grid item xs={6}>
                  <Button color="primary" onClick={cancelHandler} className={classes.buttonCancel} id="cancel">Cancelar</Button>
                </Grid>
                <Grid item xs={6}>
                  <Button color="primary" type="submit" variant="contained" className={classes.buttonConfirm} id="confirm">Ensinar</Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Body;
