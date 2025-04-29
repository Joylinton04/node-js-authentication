import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js'
import authRouter from './route/auth.js'


const app = express();
app.use(express.json())
app.use(cookieParser())
app.use(cors({credentials: true}))

connectDB()

//API EndPoints
app.get('/', (req,res) => res.send('API is working...'))
app.use('/api/auth', authRouter)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})