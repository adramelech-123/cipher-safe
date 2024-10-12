import express from "express"
import { checkSchema } from "express-validator";
import { accountValidationSchema } from "../utils/validationSchemas.js";
import { createAccount, deleteAccount, getAccount, getAllAccounts, updateAccount } from "../controllers/account.controllers.js"
import { verifyToken } from "../middleware/verifyToken.js";
import {validationHandler} from "../middleware/validationHandler.js"

const router = express.Router()


router.get("/", verifyToken, getAllAccounts);
router.get("/:accId", verifyToken, getAccount);

router.post('/create-account', checkSchema(accountValidationSchema), validationHandler, verifyToken, createAccount)
router.patch("/:accId", checkSchema(accountValidationSchema), validationHandler, verifyToken, updateAccount);

router.delete("/:accId", verifyToken, deleteAccount)


export default router 