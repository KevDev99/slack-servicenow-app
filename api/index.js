const axios = require("axios");
const { dbInstallation } = require("../database/models/installationModel");
const User = require("../database/models/userModel");

const refreshToken = async (userId) => {
  try {
    if (!userId) {
      throw "No user provided";
    }

    // get installation
    const user = await User.findById(userId);

    if (!user) {
      throw "user couldn't be found. " + userId;
    }

    const installation = await dbInstallation.findById(user.teamId);

    if (!installation) {
      throw "no installation found " + user.teamId;
    }

    if (!installation.servicenow) {
      throw "the installation has no oauth integration " + user.teamId;
    }

    try {
      const res = await axios.post(
        `${installation.servicenow.instance_url}/oauth_token.do`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: user.token.refresh_token,
          client_id: installation.servicenow.client_id,
          client_secret: installation.servicenow.client_secret,
        })
      );

      if (res.status !== 200) throw "Error with service now API";

      const { access_token, refresh_token } = res.data;

      // update data
      await User.updateOne(
        { _id: user._id },
        {
          token: {
            refresh_token: refresh_token,
            access_token: access_token,
          },
        }
      );

      return access_token;
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { refreshToken };
