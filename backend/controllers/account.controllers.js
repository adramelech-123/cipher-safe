import mongoose from "mongoose";
import { Account } from "../models/account.model.js"

export const getAllAccounts = async (req, res) => {
  const authenticatedUserId = req.userId;

  try {
    const accounts = await Account.find({userId: authenticatedUserId})
    res.status(200).json(accounts)
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const getAccount = async (req, res) => {
  const accountId = req.params.accId
  const authenticatedUserId = req.userId;

  try {
     if (!mongoose.isValidObjectId(accountId)) {
       throw new Error("Invalid account ID")
     }

     const account = await Account.findById(accountId).exec();

     if (!account) {
      throw new Error("Account not found!");

     }

     if (!account.userId.equals(authenticatedUserId)) {
       throw new Error(
         "This user is not Authorised to access this account"
       );
     }

     res.status(200).json(account);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }

}

export const createAccount = async (req, res) => {

  const authenticatedUserId = req.userId

  const {
    title,
    image,
    accountEmail,
    accountUsername,
    accountURL,
    accountPassword,
    description,
  } = req.body;
    
  try {
    const account = new Account({
      userId: authenticatedUserId,
      title: title,
      image: image,
      accountEmail: accountEmail,
      accountUsername: accountUsername,
      accountURL: accountURL,
      accountPassword: accountPassword,
      description: description,
    });

    await account.save();

    res.status(201).json({
      success: true,
      message: "Account saved in vault successfully!",
      account: {
        ...account._doc,
        accountPassword: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
    
}

export const updateAccount = async (req, res) => {
  const accountId = req.params.accId;
  const authenticatedUserId = req.userId;

  const {
    title,
    image,
    accountEmail,
    accountUsername,
    accountURL,
    accountPassword,
    description,
  } = req.body;

  try {

    if (!mongoose.isValidObjectId(accountId)) {
      throw new Error("Invalid account ID");
    }

    const account = await Account.findById(accountId).exec();

    if (!account) {
    throw new Error("Account not found!");
    }

    if (!account.userId.equals(authenticatedUserId)) {
      throw new Error(
        "This user is not Authorised to update this account"
      );
    }

    account.title = title
    account.image = image
    account.accountEmail = accountEmail
    account.accountUsername = accountUsername
    account.accountURL = accountURL
    account.accountPassword = accountPassword
    account.description = description

    const updatedAccount = await account.save()

    res.status(201).json(updatedAccount);

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const deleteAccount = async (req, res) => {
   const accountId = req.params.accId;
   const authenticatedUserId = req.userId;

   try {
    if (!mongoose.isValidObjectId(accountId)) {
      throw new Error("Invalid account ID");
    }

    const account = await Account.findById(accountId).exec();

    if (!account) {
      throw new Error("Account not found!");
    }

    if (!account.userId.equals(authenticatedUserId)) {
      throw new Error("This user is not Authorised to delete this account");
    }

    await account.deleteOne();

    res.status(204).json({success: true, message: "Account successfully deleted!"});
   } catch (error) {
    res.status(400).json({ success: false, message: error.message });
   }
}

