const express = require("express");
const bodyparser = require("body-parser");
const cookieParser = require('cookie-parser');

const fs = require("fs");
const filePath = __dirname + "/data/chatdata.json";
const fileraw = fs.readFileSync(filePath);
let file = JSON.parse(fileraw);
const { allowedNodeEnvironmentFlags } = require("process");
const RespondeHandler = require("./model/response_handler");
const responseHandler = new RespondeHandler(file);
const app = express();
require("dotenv").config();
const axios = require("axios").default;
axios.defaults.headers.common['Authorization'] = 'Bearer ' + process.env.WIT_TOKEN;
const wit_base_url = "https://api.wit.ai/message";

const isDebug = false;

app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/", function (req, res) {
  res.send("We live bros!");
});

app.post("/api/sendQuestion", function (req, res) {
  if (req.body && req.body.question) {
    const question = req.body.question;

    axios
    .get(wit_base_url, {
      params: {
        q: question,
      }
    })
    .then((response) => {
      if(response.status == 200) {
        let message = responseHandler.handleResponse(res, req, response.data.intents, response.data.entities);
        if (!message) {
          message = file.default_answer;
        }
        res.status(201).json({ code: 200, answer: message})
      }
    })
    .catch((error) => {
      console.log(error);
    });

  } else res.status(201).json({ code: 200, answer: "Ocorreu um erro de sistema. Por favor, tente de novo."});

  /* if (possibleAnswers)
    res
      .status(200)
      .json({ code: 200, answer: possibleAnswers.answer, isDefault: false });
  ; */
});

app.post("/api/teachBot", function (req, res) {});

const logValuesToConsole = (tag, value) => {
  if (isDebug) {
    console.log("------");
    console.log(tag);
    console.log(value);
    console.log("------");
  }
};

const normalize = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .toLowerCase();
};



app.listen(3001, () => console.log("Connected to 3001"));
