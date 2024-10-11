import {Account} from "../models/account.model.js"

export const createAccount = async (req, res) => {
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
          title: title,
          image: image,
          accountEmail: accountEmail,
          accountUsername: accountUsername,
          accountURL: accountURL,
          accountPassword: accountPassword,
          description: description,
        });

        await account.save()

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