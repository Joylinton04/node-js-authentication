import userModel, { validateUser } from "../models/userModel.js";
import bcrypt, { hash } from "bcryptjs";

export const register = async (req, res) => {
  const { error } = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.json({ success: false, message: "Missing Details" });

  try {
    const existingUser = await userModel.findOne({email});
    if (existingUser)
      return res.json({
        success: false,
        message: "User is already registered",
      });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = newUser.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.json({ success: false, message: err.message,});
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
    if (!user)
      return res.json({ success: false, message: "Invalid email" });

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

    return res.json({success: true, message: 'Logged out'})
    
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
