const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_MESSAGE_LENGTH = 500;
const CHATBOT_DEBUG = process.env.CHATBOT_DEBUG !== "false";

const MISSING_KEY_FALLBACK =
  "المساعد الذكي غير مفعّل حالياً. يمكنك طرح أسئلة عامة عن طلب المساعدة أو التبرع أو الكفالة أو التواصل مع المركز.";

const EMPTY_MESSAGE_FALLBACK = "يرجى كتابة سؤالك حتى أتمكن من مساعدتك.";

const RATE_LIMIT_MESSAGE =
  "المساعد الذكي غير متاح مؤقتاً بسبب كثرة الطلبات، يرجى المحاولة لاحقاً.";

const RETRYABLE_STATUS_CODES = new Set([500, 502, 503, 504]);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function debugLog(label, value) {
  if (!CHATBOT_DEBUG) {
    return;
  }

  console.log(`[chatbot] ${label}`, {
    timestamp: new Date().toISOString(),
    value,
  });
}

function createChatbotError(message, statusCode = 503, details = null) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
}

function maskApiKey(key) {
  if (!key) {
    return "missing";
  }

  return key.length >= 10
    ? `${key.slice(0, 6)}...${key.slice(-4)}`
    : "present-but-too-short";
}

function buildPrompt(message) {
  return `
أنت مساعد عربي لموقع مركز رعاية الأيتام.
أجب باللغة العربية فقط وبأسلوب واضح ومهذب ومفيد وغير طويل.
مهمتك هي الإجابة عن أسئلة عامة فقط حول:
- طلبات المساعدة عبر الموقع
- التبرعات
- الكفالة
- التواصل مع المركز
- معلومات عامة عن خدمات مركز رعاية الأيتام

معلومات الموقع الحالية: صفحة التبرع تدعم إدخال مبلغ وطريقة دفع فقط، ولا يظهر في النظام حالياً خيار تبرع يومي أو تبرع متكرر تلقائي. إذا سأل المستخدم هل يمكنه التبرع يومياً أو بشكل متكرر، فأجب: لا، لا يوجد حالياً نظام تبرع يومي أو متكرر تلقائي في الموقع.
إذا كان سؤال المستخدم بصيغة نعم أو لا، فأجب بكلمة نعم أو لا أولاً، ثم أضف توضيحاً قصيراً فقط إذا كان ذلك ضرورياً. إذا كانت المعلومة غير مؤكدة من سياق الموقع، قل بوضوح إن الأمر يحتاج إلى مراجعة فريق المركز.
قدّم خطوات واضحة عند السؤال عن طريقة تنفيذ خدمة مثل طلب المساعدة أو الكفالة أو التبرع.
اكتب إجابة مكتملة دائماً. لا تنه الرد بقائمة ناقصة أو جملة غير مكتملة. إذا استخدمت قائمة، يجب أن تكون قصيرة ومغلقة بالكامل.
تجنب تنسيق Markdown مثل ** أو عناوين معقدة. استخدم نصاً عربياً بسيطاً مناسباً للعرض داخل فقاعة محادثة.
لا تستخدم Markdown أو رموز تنسيق مثل * أو ** أو # أو القوائم البرمجية. اكتب النص كنص عربي عادي مناسب للعرض داخل نافذة المحادثة.
لا تستخدم قوائم مرقمة. اكتب الإجابة في فقرة قصيرة من جملتين إلى أربع جمل مكتملة.
لا تخترع أرقاماً أو إحصائيات أو أسماء أيتام أو متبرعين أو كفلاء.
لا تدّعي أنك تستطيع الوصول إلى قاعدة البيانات أو ملفات المركز.
إذا سأل المستخدم عن أرقام حقيقية أو إحصائيات أو حالة طلب محدد، قل إن هذه المعلومات تحتاج إلى مراجعة فريق المركز.
إذا كان السؤال خارج نطاق مركز رعاية الأيتام، اعتذر بلطف وقل إنك تستطيع المساعدة فقط في الأسئلة المتعلقة بالمركز.

سؤال المستخدم:
${message}
`.trim();
}

function normalizeMessage(message) {
  if (typeof message !== "string") {
    return "";
  }

  return message.trim().slice(0, MAX_MESSAGE_LENGTH);
}

function extractGeminiText(data) {
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim() || ""
  );
}

function isRetryableResponse(response) {
  return RETRYABLE_STATUS_CODES.has(response.status);
}

async function requestGemini(prompt) {
  return fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1200,
        thinkingConfig: {
          thinkingBudget: 0,
        },
      },
    }),
  });
}

async function getChatbotReply(message) {
  const normalizedMessage = normalizeMessage(message);
  debugLog("incoming message", normalizedMessage);

  if (!normalizedMessage) {
    debugLog("final reply", EMPTY_MESSAGE_FALLBACK);
    return EMPTY_MESSAGE_FALLBACK;
  }

  if (!process.env.GEMINI_API_KEY) {
    debugLog("missing Gemini API key", true);
    debugLog("final reply", MISSING_KEY_FALLBACK);
    return MISSING_KEY_FALLBACK;
  }

  try {
    debugLog("provider config", {
      model: GEMINI_MODEL,
      apiKey: maskApiKey(process.env.GEMINI_API_KEY),
      apiKeyLength: process.env.GEMINI_API_KEY.length,
    });

    const prompt = buildPrompt(normalizedMessage);
    debugLog("prompt sent to AI", prompt);

    let response = await requestGemini(prompt);
    let rawBody = await response.text();
    debugLog("raw AI response", {
      status: response.status,
      ok: response.ok,
      body: rawBody.slice(0, 2000),
    });

    if (isRetryableResponse(response)) {
      await delay(800);
      response = await requestGemini(prompt);
      rawBody = await response.text();
      debugLog("raw AI retry response", {
        status: response.status,
        ok: response.ok,
        body: rawBody.slice(0, 2000),
      });
    }

    if (!response.ok) {
      throw createChatbotError(
        response.status === 429
          ? RATE_LIMIT_MESSAGE
          : "تعذر الاتصال بالمساعد الذكي حالياً. تحقق من إعدادات مزود الذكاء الاصطناعي أو الحصة المتاحة.",
        response.status === 429 ? 429 : 502,
        rawBody.slice(0, 2000)
      );
    }

    const data = JSON.parse(rawBody);
    const reply = extractGeminiText(data);

    if (!reply) {
      throw createChatbotError(
        "لم يرجع مزود الذكاء الاصطناعي نصاً صالحاً.",
        502,
        rawBody.slice(0, 2000)
      );
    }

    debugLog("final reply", reply);
    return reply;
  } catch (error) {
    debugLog("caught error", {
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
    });
    throw error.statusCode
      ? error
      : createChatbotError("تعذر الاتصال بالمساعد الذكي حالياً.", 503, error.message);
  }
}

module.exports = {
  getChatbotReply,
};
