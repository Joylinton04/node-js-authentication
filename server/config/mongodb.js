import mongoose from "mongoose";

const connectDB = async() => {
    mongoose.connection.on('connected', () => console.log('Database connected...'))
    await mongoose.connect(`${process.env.VITE_MONGODB_URL}/mern-auth`)
}

export default connectDB