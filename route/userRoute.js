import express from "express"
import authMiddleware from "../middleware/userAuth.js"
import { getUserData } from "../controller/userController.js"

const userRouter = express.Router()

userRouter.get('/data', authMiddleware, getUserData)


export default userRouter;