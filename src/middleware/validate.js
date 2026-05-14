const { ZodError } = require("zod");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (err) {
      const issues = err instanceof ZodError ? err.issues : err.issues || err.errors || [];
      const errors = issues.map((issue) => ({
        field: Array.isArray(issue.path) ? issue.path.join(".") : issue.path,
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: errors[0]?.message || "Invalid request data",
        errors,
      });
    }
  };
};

module.exports = validate;
