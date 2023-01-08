const { base64encode } = require("nodejs-base64");
const { dbInstallation } = require("../database/models/installationModel.js");

const User = require("../database/models/userModel.js");

const axios = require("axios");

const snowAuthRedirect = (receiver) => {
  // redirect for servicenow api
  receiver.router.get("/snow_oauth_redirect", async (req, res) => {
    try {
      res.writeHead(200);
      const code = req.param("code");
      const state = req.param("state");

      const [userId, teamId] = state.split("-");

      if(!code) return;
    
      if (!userId || !teamId) {
        throw "No userid or teamid from state provided";
      }

      // get installation
      const installation = await dbInstallation.findOne({ _id: teamId });

      if(!installation.servicenow) {
        throw "no installation object found!";
      }

      const clientId = installation.servicenow.client_id;
      const clientSecret = installation.servicenow.client_secret;
      
      const redirectUri = process.env.REDIRECT_URL;

      const auth = base64encode(`${clientId}:${clientSecret}`);

      const axiosResponse = await axios.post(
        `${installation.servicenow.instance_url}/oauth_token.do`,
        new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic " + auth,
          },
        }
      );

      const { access_token, refresh_token, expires_in } = axiosResponse.data;

      if (!access_token) {
        throw "No access token received";
      }

      await User.updateOne(
        { _id: userId },
        {
          teamId,
          token: {
            access_token,
            refresh_token,
            expires_in,
          },
        },
        { upsert: true }
      );

      res.end("Endpoint working OK");
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = snowAuthRedirect;
