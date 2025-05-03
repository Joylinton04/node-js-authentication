import userModel from "../models/userModel.js";

export const getUserData = async (req,res) => {
    try{
        const userId = req.user;
        const user = await userModel.findById(userId)
        if(!user)
            return res.json({success: false, message: "No user found"})

        return res.json({
            success: true, 
            userData: {
                name: user.name,
                isAccountVerified: user.isVerified
            }
        });
    }catch(err) {
        return res.json({ success: false, message: err.message });
    }
}