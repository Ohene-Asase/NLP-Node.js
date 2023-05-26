// const { NlpManager } = require("node-nlp");
// const fs = require("fs");
// const files = fs.readdirSync("./intents");

// const manager = new NlpManager({ languages: ["en"] });

// for (const file of files) {
//   let data = fs.readFileSync(`./intents/${file}`);
//   data = JSON.parse(data);
//   const intent = file.replace(".json", "");
//   for (const question of data.questions) {
//     manager.addDocument("en", question, intent);
//   }
//   for (const answer of data.answers) {
//     manager.addAnswer("en", intent, answer);
//   }
// }

// async function train_save() {
//   try {
//     await manager.train();
//     manager.save();
//   } catch (err) {
//     console.error(err);
//   }
// }

// train_save();

const { NlpManager } = require("node-nlp");
const fs = require("fs");
const files = fs.readdirSync("./intents");

const manager = new NlpManager({ languages: ["en"] });

for (const file of files) {
  let data = fs.readFileSync(`./intents/${file}`);
  data = JSON.parse(data);
  const intent = file.replace(".json", "");
  for (const question of data.questions) {
    manager.addDocument("en", question, intent);
  }
}

async function train_save() {
  try {
    await manager.train();
    manager.save();
  } catch (err) {
    console.error(err);
  }
}

train_save();

// Function to get the answer based on user input
async function getAnswer(input) {
  const response = await manager.process("en", input);
  if (response.intent) {
    const intent = response.intent[0].value;
    const answer = manager.findAnswer("en", intent);
    return answer;
  } else {
    return "Sorry, I don't understand. Can you please rephrase your question?";
  }
}