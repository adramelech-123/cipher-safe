import express from "express"
import { checkSchema } from "express-validator";
import { accountValidationSchema } from "../utils/validationSchemas.js";
import { createAccount } from "../controllers/account.controllers.js"
import { verifyToken } from "../middleware/verifyToken.js";
import {validationHandler} from "../middleware/validationHandler.js"

const router = express.Router()

router.post('/create-account', checkSchema(accountValidationSchema), validationHandler, verifyToken, createAccount)

export default router 