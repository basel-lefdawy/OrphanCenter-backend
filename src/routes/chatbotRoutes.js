const express = require("express");
const { sendChatbotMessage } = require("../controllers/chatbotController");

const router = express.Router();
// POST /api/chatbot - send a message to the chatbot and get a reply
router.post("/", sendChatbotMessage);

module.exports = router;
