const validate = (schema) => {
  return async function (req, res, next) {
    try {
      req.body = await schema.parseAsync(req.body);

      next();
    } catch (err) {
      return res.status(400).json({
        message: "Validation Error",
        errors: err.errors,
      });
    }
  };
};

module.exports = validate;