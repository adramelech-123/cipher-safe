import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  accountEmail: {
    type: String,
  },
  accountUsername: {
    type: String,
  },
  accountURL: {
    type: String,
  },
  accountPassword: {
    type: String,
  },
  description: {
    type: String,
  },
});

export const Account = mongoose.model("Account", accountSchema);