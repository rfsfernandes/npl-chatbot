const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const fs = require("fs");

const fileraw = fs.readFileSync(__dirname + "/data/chatdata.json");
const file = JSON.parse(fileraw);
const defaultAnwer = file.default;
const questionsList = Object.values(file.questionlist);

app.use(bodyparser.urlencoded({ extended: true }));

app.get("/api/", function (req, res) {
  res.send("We live bros!");
});

app.post("/api/getAnswers", function (req, res) {
  let possibleAnswers = questionsList.find((currentvalue) => {
    let cenas = currentvalue.questions.find((value) => {
      if (value == req.body.question) return currentvalue.answer;
    });

    if (cenas) return cenas;
  });
  if (possibleAnswers) res.send(possibleAnswers.answer);
  else res.send(defaultAnwer);

});

app.listen(3000, () => console.log("Connected to 3000"));