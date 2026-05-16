const { getChatbotReply } = require("../services/chatbotService");
const { sendSuccess } = require("../utils/apiResponse");

async function sendChatbotMessage(req, res, next) {
  try {
    const reply = await getChatbotReply(req.body?.message);

    return sendSuccess(res, { reply }, "Chatbot reply generated");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  sendChatbotMessage,
};
