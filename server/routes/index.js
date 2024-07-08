const express = require('express');
const registerUser = require('../controller/registerUser');
const checkEmail = require('../controller/checkEmail');
const checkPassword = require('../controller/checkPassword');
const userDetails = require('../controller/userDetails');
const logOut = require('../controller/logout');
const updateUserDetails = require('../controller/updateUserDetails');
const SearchUser = require('../controller/searchUser');

const router = express.Router();

// create user api
router.post('/register', registerUser);

// email verify
router.post('/email', checkEmail);

// password verify
router.post('/password', checkPassword);

// loggin user details
router.get('/user-details', userDetails);

//logout
router.get('/logout', logOut);

// updating the user details
router.post('/update-user', updateUserDetails);

// searching the user
router.post('/search-user', SearchUser)

module.exports = router;