const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const userModel = require("../models/userModel");

async function updateUserDetails (req, res) {
    try {
        const token = req.cookies.token || ''

        const user = await getUserDetailsFromToken(token);

        const { name , profile_pic} = req.body;

        const updateUser = await userModel.updateOne({_id : user._id},{
            name,
            profile_pic
        });

        const userInfo = await userModel
          .findById(user._id)
          .lean()

        return res.json({
            message : 'Profile Updated',
            data : userInfo,
            success : true
        })

    } catch (error) {
        return res.status(500).json({
            message : error.message || error,
            error : true
        })
    }
}

module.exports = updateUserDetails;