import mongoose from "mongoose";
import { Schema } from "mongoose";

const apiKeySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, maxlength: 100 },
  provider: { type: String, required: true, maxlength: 50 },
  keyId: { type: String, maxlength: 100 },
  secretKey: { type: String, required: true },
  permissions: [{ type: String, maxlength: 50 }],
  expiresAt: { type: Date },
  lastUsed: { type: Date },
  tags: [{ type: String, maxlength: 30 }],
  notes: { type: String, maxlength: 1000 },
}, { timestamps: true });

apiKeySchema.index({ userId: 1, title: "text", provider: "text" });

export const APIKey = mongoose.model("APIKey", apiKeySchema);