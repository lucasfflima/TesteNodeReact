// Simple Zod-based validation middleware
const validate = (schema, property = 'body') => (req, res, next) => {
  const parsed = schema.safeParse(req[property]);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation error',
      details: parsed.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  req[property] = parsed.data;
  return next();
};

module.exports = validate;