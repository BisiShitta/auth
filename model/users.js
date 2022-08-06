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

const User = mongoose.model("users", userSchema);
module.exports = User;
