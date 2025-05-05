import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from '../server/config/mongodb.js'
import authRouter from '../server/route/auth.js'
import userRouter from '../server/route/userRoute.js'

const allowedOrigins = ['http://localhost:5173/']

const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(cors({origin: allowedOrigins, credentials: true}))

connectDB()

//API EndPoints
app.get('/', (req,res) => res.send('API is working...'))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})