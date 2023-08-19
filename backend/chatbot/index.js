const express = require("express");

const chatBotService = require("./chatbot.service");

const router = express.Router();

router.post("/chatbot/input", chatBotService.ChatBot);

router.post("/chatbot/clear_session", chatBotService.clearSession);
exports.chatbotRouter = router;
