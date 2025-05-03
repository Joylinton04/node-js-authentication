import express from "express";
import { isAuthenticated, login, logout, register, resetPassword, sendResetOTP, sendVerifyOtp, verifyEmail } from "../controller/authController.js";
import authMiddleware from "../middleware/userAuth.js";

const authRouter = express.Router()


authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)

//otp verification endpoints
authRouter.post('/send-verify-otp', authMiddleware, sendVerifyOtp)
authRouter.post('/verify-account', authMiddleware, verifyEmail)

authRouter.post('/is-auth', authMiddleware, isAuthenticated)

// reset password endpoints
authRouter.post('/send-reset-otp', sendResetOTP)
authRouter.post('/reset-password', resetPassword)


export default authRouter;