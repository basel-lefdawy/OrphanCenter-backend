const { ZodError } = require("zod");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (err) {
      console.log("VALIDATION ERROR:", err); 

      if (err instanceof ZodError) {
        return res.status(400).json({
          message: "Validation Error",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
      }

      return res.status(400).json({
        message: "Invalid Request",
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
