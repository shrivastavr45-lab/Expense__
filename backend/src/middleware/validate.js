import { validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const mapped = {};
    errors.array().forEach(e => { mapped[e.path] = e.msg; });
    return res.status(400).json({ status: 400, error: 'Validation Failed', errors: mapped });
  }
  next();
};

export default validate;
