import React, { useState, useEffect } from "react";
import MessageList from "./messagelist";
import UserInput from "./userinput";

const INITIAL_STATE = [
    {
        id: 0,
        messageText: "Olá! Eu sou o Asdrubal",
        type: 0
    }
]

const FORM_INITIAL_STATE = {
  text: "",
};

function Body() {
    const [messageList, setMessageList] = useState(INITIAL_STATE)
    const [formFields, setFormFields] = useState(FORM_INITIAL_STATE);

    const postQuestion = (event) => {
      event.preventDefault()

      setMessageList((previous => [
        ...previous,
        {
          id: messageList.length,
          messageText: formFields.text,
          type: 1
        }
      ]))

      setFormFields(() => ({
        text: "",
      }))
      console.log(formFields.text);
    }

    const handleFieldChange = (event) => {
      const { name, value } = event.target
      setFormFields(() => ({
        text: value,
      }))
    }

    return (
      <div className="body">
        <MessageList messageList={messageList} />
        <UserInput inputValue={formFields.text} onChangeEvent={handleFieldChange} onSubmit={postQuestion}/>
      </div>
    );
  }
  
  export default Body;