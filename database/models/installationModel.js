const mongoose = require("mongoose");
const installationSchema = mongoose.Schema(
  {
    _id: String,
    team: { id: String, name: String },
    enterprise: { id: String, name: String },
    user: { token: String, scopes: [String], id: String },
    tokenType: String,
    isEnterpriseInstall: Boolean,
    appId: String,
    authVersion: String,
    bot: {
      scopes: [String],
      token: String,
      userId: String,
      id: String,
    },
    servicenow: {
      instance_url: String,
      client_id: String,
      client_secret: String,
    },
  },
  { _id: false, timestamps: true }
);

module.exports = {
  dbInstallation: mongoose.model("Installation", installationSchema),
};
