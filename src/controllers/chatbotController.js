const { getChatbotReply } = require("../services/chatbotService");
const { sendSuccess } = require("../utils/apiResponse");

async function sendChatbotMessage(req, res, next) {
  try {
    console.log("[chatbot] /api/chatbot request", {
      timestamp: new Date().toISOString(),
      message: req.body?.message,
    });
    const reply = await getChatbotReply(req.body?.message);
    console.log("[chatbot] controller final JSON", {
      timestamp: new Date().toISOString(),
      success: true,
      data: { reply },
    });

    return sendSuccess(res, { reply }, "Chatbot reply generated");
  } catch (err) {
    console.error("[chatbot] controller error", {
      timestamp: new Date().toISOString(),
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
    });
    next(err);
  }
}

module.exports = {
  sendChatbotMessage,
};
