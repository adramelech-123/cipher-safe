import express from 'express'
import { checkSchema } from "express-validator";
import { userValidationSchema } from '../utils/validationSchemas.js';
import { signup } from '../controllers/auth.controllers.js';

const router = express.Router()

router.post('/signup', checkSchema(userValidationSchema), signup)

export default router