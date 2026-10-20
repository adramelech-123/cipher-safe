import mongoose from "mongoose";
import { Schema } from "mongoose";

const secureNoteSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  format: { type: String, enum: ["plaintext", "markdown"], default: "markdown" },
  tags: [{ type: String, maxlength: 30 }],
  isPinned: { type: Boolean, default: false },
  color: { type: String, maxlength: 7, match: /^#[0-9A-Fa-f]{6}$/ },
}, { timestamps: true });

secureNoteSchema.index({ userId: 1, title: "text", content: "text" });

export const SecureNote = mongoose.model("SecureNote", secureNoteSchema);