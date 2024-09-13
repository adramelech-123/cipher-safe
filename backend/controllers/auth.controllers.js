import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
     
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode()

    const user = new User({
      email,
      password: hashedPassword,
      username,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await user.save();

    // Create JWT Token and set cookie
    generateTokenAndSetCookie(res, user)

    // Send Verification Email
    await sendVerificationEmail(user.email, verificationToken)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });


  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
