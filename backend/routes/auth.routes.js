import express from 'express'
import { checkSchema, validationResult } from "express-validator";
import { userValidationSchema } from '../utils/validationSchemas.js';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)
router.post('/signup', checkSchema(userValidationSchema), (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
    //   const errorMessage = validationErrors.array().map((error) => error.msg);
      return res.status(400).json({ errors: validationErrors.array() });
    }
    next();
}, signup)

router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router