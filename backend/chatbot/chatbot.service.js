const fs = require("fs");

const { TrendingItemFinderTool } = require("./tools");

const { initializeAgentExecutorWithOptions } = require("langchain/agents");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { ConversationSummaryBufferMemory } = require("langchain/memory");

const { writeObjectToFile } = require("../utils");

const sessions = {};
const tools = [new TrendingItemFinderTool()];

async function clearSession(req, res, next) {
  const { sess_id } = req.body;

  sessions[sess_id] = null;

  res.value = null;
  next();
}

async function ChatBot(req, res, next) {
  const { input, sess_id, user_id } = req.body;

  console.log("IHNPUT::: ", input);
  try {
    writeObjectToFile("./data/id.json", { user_id });

    let memory;
    if (sessions[sess_id]) {
      memory = sessions[sess_id];
    } else {
      memory = new ConversationSummaryBufferMemory({
        llm: new ChatOpenAI({
          modelName: "gpt-3.5-turbo-0613",
          temperature: 0,
          openAIApiKey: process.env.OPEN_AI_KEY,
        }),
        memoryKey: "chat_history",
        returnMessages: true,
      });
      sessions[sess_id] = memory;
    }

    const chat = new ChatOpenAI({
      modelName: "gpt-3.5-turbo-0613",
      temperature: 0,
      openAIApiKey: process.env.OPEN_AI_KEY,
    });

    const executor = await initializeAgentExecutorWithOptions(tools, chat, {
      agentType: "openai-functions",
      // verbose: true,
      memory,
      agentArgs: {
        prefix: `
   You are a helpful fashion AI assistant for an online apparel store and you do everything that you can
   to help your customers find items to purchase from the store. You should talk
   with the user and understand the following:
   - The section among "Mens", "Womens", "Kids boys", "Kids girls", "Sports", "Unisex" that the user is looking to shop in.
   - The categories of items the user is looking for in those sections.
   - The color of the item that the user wants. Choose one from: "Brown","Blue","Grey","Bluish Green","Red","Beige","Pink","Green","Metal","Black","White","Turquoise","Khaki green","Mole","Yellowish Green","Orange","Lilac Purple","Yellow"
  
   Always encode all three, the section, the category, and the user's color preference, when calling the TredingItemSearch function.
   
   Do not ask the user directly for their section preference, if you can infer it with confidence from user input.
  
   Do not deviate the conversation away from apparel/fashion. If the user talks about
   something else remind them that you are just an apparel chat bot and will only talk about that.

   Give all your responses in markdown.

   Always use image syntax for links:
   DO: ![alt-text](url)
   DO NOT: [alt-text](url)
  `,
      },
    });

    const response = await executor.call({
      input: input,
    });
    const output = response.output;
    console.log("INITIALISATION DONE>>>", output);
    return res.json({ output });
  } catch (err) {
    console.log("ERRRR::::", err);
    res.status(500).json({ error: "Server error" });
  }
  return null;
}

module.exports = {
  ChatBot,
  clearSession,
};
