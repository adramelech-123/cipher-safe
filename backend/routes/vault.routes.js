import express from "express";
import { checkSchema, validationResult } from "express-validator";
import {
  passwordValidationSchema,
  sshKeyValidationSchema,
  apiKeyValidationSchema,
  creditCardValidationSchema,
  secureNoteValidationSchema,
} from "../utils/validationSchemas.js";
import {
  getAllItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
  getVaultStats,
  bulkDelete,
  exportVault,
} from "../controllers/vault.controllers.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { validationHandler } from "../middleware/validationHandler.js";

const router = express.Router();

router.get("/stats", verifyToken, getVaultStats);
router.post("/bulk-delete", verifyToken, bulkDelete);
router.post("/export", verifyToken, exportVault);

const types = [
  { name: "passwords", schema: passwordValidationSchema },
  { name: "ssh-keys", schema: sshKeyValidationSchema },
  { name: "api-keys", schema: apiKeyValidationSchema },
  { name: "credit-cards", schema: creditCardValidationSchema },
  { name: "secure-notes", schema: secureNoteValidationSchema },
];

for (const { name, schema } of types) {
  const setType = (req, _res, next) => {
    req.params.type = name;
    next();
  };
  router.get(`/${name}`, verifyToken, setType, getAllItems);
  router.get(`/${name}/:id`, verifyToken, setType, getItem);
  router.post(`/${name}`, checkSchema(schema), validationHandler, verifyToken, setType, createItem);
  router.patch(`/${name}/:id`, checkSchema(schema), validationHandler, verifyToken, setType, updateItem);
  router.delete(`/${name}/:id`, verifyToken, setType, deleteItem);
}

export default router;