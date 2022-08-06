const mongoose = require("mongoose");
const uuid = require("uuid").v1;
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userRole: {
      required: true,
      type: String,
      enum: ["user", "staff", "manager", "admin"],
      default: "user",
    },
    isUser: {
      required: true,
        type: Boolean,
        default: 1
    },
    isAdmin: {
      required: true,
        type: Boolean,
        default: 0
    },
    forgot_password_token: {
      type: String,
    },
  },
  { timestamps: true }
);
// // virtual field
// userSchema
//   .virtual("password")
//   .set(function (password) {
//     this._password = password;
//     this.salt = uuid();
//     this.hashed_password = this.encryptPassword(password);
//   })
//   .get(function () {
//     return this._password;
//   });

// userSchema.methods = {
//   authenticate: function (plainText) {
//     return this.encryptPassword(plainText) === this.hashed_password;
//   },

//   encryptPassword: function (password) {
//     if (!password) return "";
//     try {
//       return crypto
//         .createHmac("sha1", this.salt)
//         .update(password)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   },
// };

// //generate token
// userSchema.methods.generateToken = function () {
//   const token = jwt.sign(
//     {
//       id: this._id,
//       email: this.email,
//       user: this,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: 60 * 60 * 60 * 24 * 90 }
//   );
//   return token;
// };

// userSchema.set("toJSON", {
//   transform: function (doc, ret, opt) {
//     delete ret["password"];
//     delete ret["hashed_password"];
//     delete ret["salt"];
//     delete ret["__v"];
//     delete ret["forgot_password_token"];
//     delete ret["invite_token"];
//     return ret;
//   },
// });

const User = mongoose.model("users", userSchema);
module.exports = User;
