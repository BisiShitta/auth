const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
      token: String,
    },
    { timestamps: true }
);

const Token = mongoose.model("tokens", tokenSchema);
module.exports = Token;