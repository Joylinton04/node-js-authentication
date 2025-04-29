import mongoose from "mongoose";
import Joi from "joi";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    verifyOtp: {type: String, default: ''},
    verifyOtpExpireAt: {type: Number, default: 0},
    isVerfied: {type: Boolean, default: false},
    resetOtp: {type: String, default: ''},
    resetOtpExpireAt: {type: Number, default: 0},
})


const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export async function validateUser(user) {
    const Schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(255).required()
    })

    return Schema.validate(user)
}

export default userModel;