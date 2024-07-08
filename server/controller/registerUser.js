const userModel = require("../models/userModel");
const bycriptJs = require("bcryptjs")

async function registerUser (req, res) {
    try {
        const {name , email , password , profile_pic} = req.body;

        const checkEmail = await userModel.findOne({ email }) // to check if the email is already in the database or not

        if (checkEmail) {
            return res.status(400).json({
                message : 'User already exists.',
                error : true
            })
        }

        // password into hash password

        const salt = await bycriptJs.genSalt(10);
        const hashPassword = await bycriptJs.hash(password, salt)

        // creating user

        const payload = {
            name,
            email,
            profile_pic,
            password : hashPassword
        }

        const user = new userModel(payload);
        const userSave = await user.save();

        return res.status(201).json({
            message : 'Account created successfully',
            data : userSave,
            success : true,
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = registerUser;