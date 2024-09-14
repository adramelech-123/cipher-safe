import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import crypto from "crypto"
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";


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

export const verifyEmail = async(req, res) => {
  const { code }= req.body

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: {$gt: Date.now()}
    })

    if(!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You have entered an invalid or expired verification code!",
        });
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpiresAt = undefined
    await user.save()

    await sendWelcomeEmail(user.email, user.username)

    res.status(200).json({
      success: true,
      message: "Email verified successfully! ✅",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Error in email verification: ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

export const login = async(req, res) => {

  const {email, password} = req.body

  try {
    const user = await User.findOne({email})
    

    if(!user) {
      return res.status(400).json({success: false, message: "This user does not exist!"})
    }

    const passwordIsValid = await bcrypt.compare(password, user.password)
    if(!passwordIsValid) {
      return res.status(400).json({success: false, message: "Invalid credentials"})
    }

    generateTokenAndSetCookie(res, user._id)

    user.lastLogin = new Date()
    await user.save()

    res.status(200).json({
      success: true,
      message: "User logged in successfully! ✅",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out succesfully." });
};

export const forgotPassword = async (req, res) => {
  const {email} = req.body

  try {
    const user = await User.findOne({email})

    if(!user) {
      return res.status(400).json({success: false, message: "User not found!"})
    }

    // Generate Reset Token and token expiry date
    const resetToken = crypto.randomBytes(20).toString("hex")
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

    // Set User password reset token and expiry
    user.resetPasswordToken = resetToken
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt

    await user.save()

    // Send Password Reset Email
    sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)
    res
      .status(200)
      .json({ success: true, message: "Password reset link sent to email" });

  } catch (error) {
    console.log("Error in forgot password", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export const resetPassword = async (req, res) => {
  const {token} = req.params
  const {password} = req.body

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // Update Password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });

  } catch (error) {
    console.log("Error in resetPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }

}

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth", error);

    res.status(400).json({ success: false, message: error.message });
  }
};