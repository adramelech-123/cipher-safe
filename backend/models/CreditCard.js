import mongoose from "mongoose";
import { Schema } from "mongoose";

const billingAddressSchema = new Schema({
  line1: { type: String, maxlength: 200 },
  line2: { type: String, maxlength: 200 },
  city: { type: String, maxlength: 100 },
  state: { type: String, maxlength: 100 },
  postalCode: { type: String, maxlength: 20 },
  country: { type: String, maxlength: 2 },
}, { _id: false });

const creditCardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, maxlength: 100 },
  cardType: { type: String, enum: ["visa", "mastercard", "amex", "discover", "other"], required: true },
  last4: { type: String, required: true, match: /^\d{4}$/ },
  cardBrand: { type: String },
  expiryMonth: { type: Number, required: true, min: 1, max: 12 },
  expiryYear: { type: Number, required: true },
  cardholderName: { type: String, maxlength: 100 },
  encryptedToken: { type: String, required: true },
  billingAddress: billingAddressSchema,
  tags: [{ type: String, maxlength: 30 }],
  notes: { type: String, maxlength: 1000 },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

creditCardSchema.index({ userId: 1, title: "text" });

export const CreditCard = mongoose.model("CreditCard", creditCardSchema);