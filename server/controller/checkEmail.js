const userModel = require("../models/userModel");

async function checkEmail (req, res) {
    try {
        const { email } = req.body;

        const checkEmail = await userModel.findOne({ email }).select("-password");

        if (!checkEmail) {
            return res.status(400).json({
                message : 'Account not found',
                error : true
            })
        }

        return res.status(200).json({
            message : 'Account verified',
            success : true,
            data : checkEmail
        })


    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = checkEmail;