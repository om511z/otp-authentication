const User = require("../models/usermodel");

const { createJwtToken } = require("../utils/token.util");

const { generateOTP, fast2sms } = require("../utils/otp.util");

// --------------------- create new user ---------------------------------

exports.createNewUser = async (req, res, next) => {

  try {
    let { phone, name } = req.body;


    // check duplicate phone Number
    const phoneExist = await User.findOne({ phone });

    if (phoneExist) {
      next({ status: 400, message: "Please enter another no" });
      return;
    }


    // create new user
    const createUser = new User({
      phone,
      name,
      role : phone === process.env.ADMIN_PHONE ? "ADMIN" :"USER"
    });

    // save user

    const user = await createUser.save();

    res.status(200).json({
      type: "success",
      message: "Account created OTP sended to mobile number",
      data: {
        userId: user._id,
      },
    });

    // generate otp
    const otp = generateOTP(6);
    // save otp to user collection
    user.phoneOtp = otp;
    await user.save();
    // send otp to phone number
    await fast2sms(
      {
        message: `Your OTP is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
 
};



// ------------ login with phone otp ----------------------------------

exports.loginWithPhoneOtp = async (req, res, next) => {
  try {

    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      next({ status: 400, message: 'phone no invalid' });
      return;
    }

        // generate otp
        const otp = generateOTP(6);
        // save otp to user collection
        user.phoneOtp = otp;
        user.isAccountVerified = true;

    res.status(201).json({
      type: "success",
      message: "OTP sended to your registered phone number",
      data: {
        userId: user._id,
        otp
      },
    });


    await user.save();
    // send otp to phone number
    await fast2sms(
      {
        message: `Your OTP from om khot is ${otp}`,
        contactNumber: user.phone,
      },
      next
    );
  } catch (error) {
    next(error);
  }
};

// ---------------------- verify phone otp -------------------------
exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp, userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      next( 'user not found' );
      return;
    }

    if (user.phoneOtp !== otp) {
      next( 'incorrect otp');
      return;
    }
    const token = createJwtToken({ userId: user._id });

    user.phoneOtp = "";
    await user.save();

    res.status(201).json({
      type: "success",
      message: "OTP verified successfully",
      data: {
        token,
        userId: user._id,
      },
    });
  } catch (error) {
    next(error);
  }
};



