import React, { useState, useEffect } from "react";
import MessageList from "./messagelist";
import UserInput from "./userinput";
import Card from '@material-ui/core/Card';

const axios = require('axios').default;
const INITIAL_STATE = [
  {
    id: 0,
    messageText: "Olá! Eu sou o Asdrubal",
    type: 0,
  },
];

const FORM_INITIAL_STATE = {
  text: "",
};

function Body() {
  const [messageList, setMessageList] = useState(INITIAL_STATE);
  const [formFields, setFormFields] = useState(FORM_INITIAL_STATE);

  const postQuestion = (event) => {
    event.preventDefault();
    if(formFields.text) {
      setMessageList((previous) => [
        ...previous,
        {
          id: messageList.length,
          messageText: formFields.text,
          type: 1,
        },
      ]);
      
      axios.post('http://localhost:3001/api/getAnswers', {
        'question': formFields.text
      },
      
      ).then(function (response) {
        console.log(response);
        setMessageList((previous) => [
          ...previous,
          {
            id: messageList.length+1,
            messageText: response.data.answer,
            type: 0,
          },
        ]);
      })
      .catch(function (error) {
        console.log(error);
      });
  
      setFormFields(() => ({
        text: "",
      }));
    }
    
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormFields(() => ({
      text: value,
    }));
  };

  return (
    <div className="body">
      <Card className="message-container">
        <MessageList messageList={messageList} />
        <UserInput
          inputValue={formFields.text}
          onChangeEvent={handleFieldChange}
          onSubmit={postQuestion}
        />
      </Card>
    </div>
  );
}

export default Body;
