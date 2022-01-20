const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
       
              email:{type: String},
              username:{type: String},
              photo:{type: String},
              cloudinary_id:{type: String},
              password:{type: String},
              createdAt:{type: Date, default: Date.now},
              isAdmin: Boolean,
              emailToken: String,
              superAdmin: Boolean,
              isVerified: Boolean,
              resetPasswordToken:String,
              resetPasswordExpires: Date,
            });


        module.exports = User = mongoose.model('users', UserSchema); 