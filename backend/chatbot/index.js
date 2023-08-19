const express = require("express");

const chatBotService = require("./chatbot.service");

const router = express.Router();

router.post("/chatbot/input", chatBotService.ChatBot);

exports.chatbotRouter = router;
