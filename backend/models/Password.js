import mongoose from "mongoose";
import { Schema } from "mongoose";

const passwordSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, maxlength: 100 },
  website: { type: String, maxlength: 500 },
  username: { type: String, maxlength: 100 },
  password: { type: String, required: true },
  totpSecret: { type: String },
  category: { type: String, enum: ["personal", "work", "finance", "social", "other"], default: "personal" },
  tags: [{ type: String, maxlength: 30 }],
  notes: { type: String, maxlength: 1000 },
  favicon: { type: String },
  lastUsed: { type: Date },
}, { timestamps: true });

passwordSchema.index({ userId: 1, title: "text", website: "text" });

export const Password = mongoose.model("Password", passwordSchema);