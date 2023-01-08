const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    _id: String,
    teamId: String,
    token: {
      access_token: String,
      refresh_token: String,
      expires_in: Number,
    },
  },
  { _id: false }
);

module.exports = mongoose.model("User", userSchema);
