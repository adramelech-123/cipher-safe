import { validationResult } from "express-validator";

export const validationHandler = (req, res, next) => {
  const validationErrors = validationResult(req);

  // if (!validationErrors.isEmpty()) {
  //   return res.status(400).json({ errors: validationErrors.array() });
  // }

  if (!validationErrors.isEmpty()) {
    const errorMessage = validationErrors.array().map((error) => error.msg);
    return res.status(400).json({ errors: errorMessage });
  }
  next();
};
