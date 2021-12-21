
const express = require("express");
const router = express.Router();



const {
  loginWithPhoneOtp,
  createNewUser,
  verifyOtp
 
} = require("../controllers/auth.controller");



router.route('/register').post(createNewUser)
router.route('/login').post(loginWithPhoneOtp)
router.route('/verify').post(verifyOtp)









module.exports = router;