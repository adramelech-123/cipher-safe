import express from 'express'
import { checkSchema, validationResult } from "express-validator";
import { resetPasswordSchema, userValidationSchema } from '../utils/validationSchemas.js';
import { checkAuth, forgotPassword, login, logout, resetPassword, signup, verifyEmail } from '../controllers/auth.controllers.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { validationHandler } from "../middleware/validationHandler.js";

const router = express.Router()

router.get('/check-auth', verifyToken, checkAuth)

router.post('/signup', checkSchema(userValidationSchema), validationHandler, signup)
router.post('/verify-email', verifyEmail)
router.post('/login', login)
router.post('/logout', logout)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', checkSchema(resetPasswordSchema), validationHandler, resetPassword)

export default router