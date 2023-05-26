const express = require("express");
const cors = require("cors");
const { NlpManager } = require("node-nlp");
const fs = require("fs");

const app = express();
const manager = new NlpManager({ languages: ["en"] });

const intentsDirectory = "./intents";
const intentsFiles = fs.readdirSync(intentsDirectory);

intentsFiles.forEach(file => {
  const data = JSON.parse(fs.readFileSync(`${intentsDirectory}/${file}`));
  const intent = file.replace(".json", "");
  data.questions.forEach(question => {
    manager.addDocument("en", question, intent);
  });
  data.answers.forEach(answer => {
    manager.addAnswer("en", intent, answer);
  });
});

async function trainAndSaveModel() {
  try {
    await manager.train();
    await manager.save();
    console.log("Model trained and saved successfully");
  } catch (error) {
    console.error("Error occurred while training and saving the model:", error);
  }
}

trainAndSaveModel();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.get("/api/chatbot/:message", async (req, res) => {
  const message = req.params.message;
  const response = await manager.process("en", message);
  const answer =
    response &&
    response.intent &&
    response.intent === "None"
      ? "Sorry, I don't understand. Can you please rephrase your question?"
      : response.answer;
  res.json({ answer });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
