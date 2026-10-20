import mongoose from "mongoose";
import { Schema } from "mongoose";

const sshKeySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, maxlength: 100 },
  host: { type: String, maxlength: 200 },
  port: { type: Number, default: 22 },
  username: { type: String, maxlength: 100 },
  privateKey: { type: String, required: true },
  publicKey: { type: String },
  passphrase: { type: String },
  keyType: { type: String, enum: ["rsa", "ed25519", "ecdsa", "ed25519-sk"], default: "ed25519" },
  fingerprint: { type: String },
  tags: [{ type: String, maxlength: 30 }],
  notes: { type: String, maxlength: 1000 },
}, { timestamps: true });

sshKeySchema.index({ userId: 1, title: "text", host: "text" });

export const SSHKey = mongoose.model("SSHKey", sshKeySchema);