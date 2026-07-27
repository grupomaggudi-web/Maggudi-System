import Joi from 'joi';

const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: error.details.map((d) => ({
        field: d.path.join('.'),
        message: d.message,
      })),
    });
  }
  req.validated = value;
  next();
};

export default validateRequest;
