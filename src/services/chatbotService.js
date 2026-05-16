const GEMINI_MODEL = "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const MAX_MESSAGE_LENGTH = 500;

const MISSING_KEY_FALLBACK =
  "المساعد الذكي غير مفعّل حالياً. يمكنك طرح أسئلة عامة عن طلب المساعدة أو التبرع أو الكفالة أو التواصل مع المركز.";

const GEMINI_ERROR_FALLBACK =
  "تعذر الحصول على رد من المساعد حالياً. يرجى المحاولة لاحقاً أو استخدام أقسام الموقع للتواصل وطلب المساعدة والتبرع والكفالة.";

const GEMINI_BUSY_FALLBACK = "المساعد مشغول حالياً، يرجى المحاولة بعد لحظات.";

const EMPTY_MESSAGE_FALLBACK = "يرجى كتابة سؤالك حتى أتمكن من مساعدتك.";

const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  if (!normalizedMessage) {
    return EMPTY_MESSAGE_FALLBACK;
  }

  if (!process.env.GEMINI_API_KEY) {
    return MISSING_KEY_FALLBACK;
  }

  try {
    const prompt = buildPrompt(normalizedMessage);
    let response = await requestGemini(prompt);

    if (isRetryableResponse(response)) {
      await delay(800);
      response = await requestGemini(prompt);
    }

    if (!response.ok) {
      console.error("Gemini chatbot request failed");
      return response.status === 429 ? GEMINI_BUSY_FALLBACK : GEMINI_ERROR_FALLBACK;
    }

    const data = await response.json();
    const reply = extractGeminiText(data);

    return reply || GEMINI_BUSY_FALLBACK;
  } catch (error) {
    console.error("Gemini chatbot request error");
    return GEMINI_ERROR_FALLBACK;
  }
}

module.exports = {
  getChatbotReply,
};
