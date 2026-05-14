const validate = (schema) => {
  return async function (req, res, next) {
    try {
      req.body = await schema.parseAsync(req.body);

      next();
    } catch (err) {
      const issues = err.issues || err.errors || [];
      const errors = issues.map((issue) => ({
        field: Array.isArray(issue.path) ? issue.path.join(".") : issue.path,
        message: issue.message,
      }));
      const message =
        errors[0]?.message || "يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.";

      return res.status(400).json({
        success: false,
        message,
        errors,
      });
    }
  };
};

module.exports = validate;
