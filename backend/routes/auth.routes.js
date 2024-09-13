import express from 'express'
import { checkSchema, validationResult } from "express-validator";
import { userValidationSchema } from '../utils/validationSchemas.js';
import { signup, verifyEmail } from '../controllers/auth.controllers.js';

const router = express.Router()

router.post('/signup', checkSchema(userValidationSchema), (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
    //   const errorMessage = validationErrors.array().map((error) => error.msg);
    
      return res.status(400).json({ errors: validationErrors.array() });
    }

    next();

}, signup)

router.post('/verify-email', verifyEmail)

export default router