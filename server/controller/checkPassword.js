const userModel = require("../models/userModel");
const bycriptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { model } = require("mongoose");

async function checkPassword (req, res) {
    try {
        const { password, userId } = req.body;

        const user = await userModel.findById(userId);

        const verifyPassword = await bycriptJs.compare(password, user.password);

        if (!verifyPassword) {
            return res.status(400).json({
                message: "Invalid Password",
                error : true
            })
        }
        
        const tokenData = {
            id : user._id,
            email : user.email
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn : "1d"});

        const cookiesOptions = {
            http : true,
            secure : true
        }

        return res.cookie('token', token , cookiesOptions).status(200).json({
            message : 'Logged in successfully',
            token : token,
            success : true,
        })
    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkPassword;