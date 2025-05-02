import userModel, { validateUser } from "../models/userModel.js";
import bcrypt, { hash } from "bcryptjs";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { error } = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: "Missing Details" });

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.json({
        success: false,
        message: "User is already registered",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });

    // sending welcome email

    const mailOptions = {
      from: process.env.VITE_SENDER_EMAIL,
      to: email,
      subject: "Welcome Message",
      text: `Welcome! Your account has been created with the email: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    const token = newUser.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await newUser.save();

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { error } = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "Missing Details" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    const token = user.generateAuthToken();
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

//send verification otp to User's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.user;
    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // generate OTP

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.VITE_SENDER_EMAIL,
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification OTP sent on Email" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.verifyOtp || user.verifyOtp !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const isAuthenticated = async (req,res) => {
  try{
    res.json({success: true})
  }catch(err) {
    return res.json({ success: true, message: "Email verified successfully" });
  }
}

// password reset OTP
export const sendResetOTP = async (req,res) => {
  try{
    const userId = req.user

    const user = await userModel.findById(userId)
    if(!user)
      return res.json({ success: false, message: "User not found" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const mailOptions = {

      from: process.env.VITE_SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. Reset your password using this OTP`,
    }

    await transporter.sendMail(mailOptions)
    res.json({ success: true, message: "Password reset OTP sent on Email" });

  }catch(err) {
    return res.json({success: false, message: err.message})
  }
}

export const verifyPassword = async (req,res) => {
  const { otp,password } = req.body;
  const userId = req.user;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== String(otp)) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const passwordSalt = await bcrypt.genSalt(10)
    const newHashedPassword = await bcrypt.hash(password, passwordSalt)

    user.password = newHashedPassword
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
}