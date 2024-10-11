import express from "express"
import { checkSchema, validationResult } from "express-validator";
import { accountValidationSchema } from "../utils/validationSchemas.js";
import { createAccount } from "../controllers/account.controllers.js"

const router = express.Router()

router.post('/create-account', checkSchema(accountValidationSchema), (req, res, next) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).json({ errors: validationErrors.array() });
    }
    next();
}, createAccount)

export default router