const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const fs = require("fs");
const { allowedNodeEnvironmentFlags } = require("process");
const filePath = __dirname + "/data/chatdata.json";
const fileraw = fs.readFileSync(filePath);
let file = JSON.parse(fileraw);
const defaultAnswer = file.default;
const thanksMessage = file.thanksMessage;
const errorMessage = file.errorMessage;
const questionsList = Object.values(file.questionlist);
const isDebug = false;

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
  let possibleAnswers = questionsList.find((currentvalue) => {
    logValuesToConsole("Current Value", currentvalue);
    let findInQuestions = currentvalue.questions.find((value) => {
      logValuesToConsole("Value", value);
      const valueArray = normalize(value).split(" ");
      logValuesToConsole("Value Array", valueArray);
      const userInputArray = normalize(req.body.question).split(" ");
      logValuesToConsole("UserInput array: ", userInputArray);
      const numberOfOccurrences = checkNumberOfOccurences(
        userInputArray,
        valueArray
      );

      let needsToBe = (3 / 4) * userInputArray.length;

      if (needsToBe % 1 >= 0.5) {
        logValuesToConsole("Was rounded up", true);
        needsToBe = Math.round(needsToBe);
      } else {
        logValuesToConsole("Was rounded up", false);
        needsToBe = Math.floor(needsToBe);
      }

      logValuesToConsole("Number of occurrences:", numberOfOccurrences);
      logValuesToConsole("Needs to be: ", needsToBe);

      if (numberOfOccurrences >= needsToBe) return currentvalue.answer;
    });
    if (findInQuestions) return findInQuestions;
  });

  if (possibleAnswers)
    res
      .status(200)
      .json({ code: 200, answer: possibleAnswers.answer, isDefault: false });
  else
    res.status(201).json({ code: 200, answer: defaultAnswer, isDefault: true });
});

app.post("/api/teachBot", function (req, res) {
  questionsList.push({
    questions: [req.body.question],
    answer: req.body.answer,
  });

  const newJson = {
    default: defaultAnswer,
    thanksMessage: thanksMessage,
    errorMessage: errorMessage,
    questionlist: questionsList,
  };
  file = newJson
  fs.writeFile(filePath, JSON.stringify(newJson), (err) => {
    if (err) {
      return res.status(201).json({ code: 200, answer: errorMessage, isDefault: false });
    }
    res
      .status(200)
      .json({ code: 200, answer: thanksMessage, isDefault: false });
  });

});

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

const checkNumberOfOccurences = (strArray1, strArray2) => {
  strArray1 = strArray1.sort();
  strArray2 = strArray2.sort();
  return strArray1.filter((value) => strArray2.includes(value)).length;
};

app.listen(3001, () => console.log("Connected to 3001"));
