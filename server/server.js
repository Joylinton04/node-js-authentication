import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRouter from './route/auth.js'
import userRouter from './route/userRoute.js'

const allowedOrigins = [
    'https://node-js-authentication-frontend.onrender.com',
    'http://localhost:5173',
]

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({ origin: allowedOrigins, credentials: true })) 

connectDB()

//API EndPoints
app.get('/', (req,res) => res.send('API is working...'))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})