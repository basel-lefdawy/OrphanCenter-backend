/**
 * Builds a non-empty message for API JSON errors (Sequelize often puts text on parent/original).
 */
function getClientErrorMessage(error, fallback = "حدث خطأ في الخادم") {
  if (!error) return fallback;
  if (typeof error === "string") return error.trim() || fallback;

  let msg = error.message != null ? String(error.message).trim() : "";

  if (!msg && Array.isArray(error.errors)) {
    msg = error.errors
      .map((e) => (e && (e.message || e.type)) || "")
      .filter(Boolean)
      .join("; ")
      .trim();
  }

  if (!msg && error.parent && error.parent.message) {
    msg = String(error.parent.message).trim();
  }

  if (!msg && error.original && error.original.message) {
    msg = String(error.original.message).trim();
  }

  return msg || (error.name && String(error.name).trim()) || fallback;
}

module.exports = { getClientErrorMessage };
