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
    let findInQuestions = currentvalue.questions.find((value) => {
      let valueArray = normalize(value).split(" ");
      /* console.log("Value array: ");
      console.log(valueArray); */
      let userInputArray = normalize(req.body.question).split(" ");
      /* console.log("UserInput array: ");
      console.log(userInputArray); */
      let numberOfOccurrences = checkNumberOfOccurences(userInputArray, valueArray);
      /* console.log("Number of occurrences: " + numberOfOccurrences);
      console.log("Needs to be: " + (3 / 4) * userInputArray.length); */
      if (numberOfOccurrences >= Math.floor((3 / 4) * userInputArray.length) )
        return currentvalue.answer;
    });
    if (findInQuestions) return findInQuestions;
  });

  if (possibleAnswers) res.send(possibleAnswers.answer);
  else res.send(defaultAnwer);
});

const normalize = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z ]/g, "").toLowerCase();
};

const checkNumberOfOccurences = (strArray1, strArray2) => {
  strArray1 = strArray1.sort();
  strArray2 = strArray2.sort();
  return strArray1.filter(value => strArray2.includes(value)).length;
};

app.listen(3000, () => console.log("Connected to 3000"));
