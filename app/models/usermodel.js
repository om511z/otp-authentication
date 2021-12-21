const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,

    },

    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength:[10,'enter 10 digit number']
    },

    role :{
     type : String,
     default:"user",
    },
 


   phoneOtp:String


  },
  { timestamps: true }
);


module.exports = model("User", userSchema);


