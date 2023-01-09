const { formatState } = require("../../helper");
const {
  dbInstallation,
} = require("../../database/models/installationModel.js");
const axios = require("axios");

const { connectedInstanceBody } = require("./app_home_opened.js");

const connectServiceNow = async ({ body, client, logger, ack }) => {
  try {
    // format body state
    const state = formatState(body.view.state.values);

    try {
      // check if instance url is reachable
      // check if instance url + client id is correct
      const instanceRes = await axios(
        `${state.instance_url}/oauth_auth.do?response_type=code&redirect_uri=${process.env.REDIRECT_URL}&client_id=${state.client_id}&state=xyzABC123`
      );

      // acknowledge request
      await ack();

      // check if last char of instance url is a "/"
      let instanceUrl = state.instance_url;
      if (instanceUrl.endsWith("/")) {
        instanceUrl = instanceUrl.substring(0, instanceUrl.length - 1);
      }

      // update values in db
      await dbInstallation.updateOne(
        { _id: body.team.id },
        {
          servicenow: {
            instance_url: instanceUrl,
            client_id: state.client_id,
            client_secret: state.client_secret,
          },
        },
        { upsert: true }
      );

      // refresh home tab

      const blocks = await connectedInstanceBody(body.user.id, {
        team: { id: body.team.id },
        servicenow: {
          instance_url: instanceUrl,
          client_id: state.client_id,
          client_secret: state.client_secret,
        },
      });
      await client.views.publish({
        // Use the user ID associated with the event
        user_id: body.user.id,
        view: {
          // Home tabs must be enabled in your app configuration page under "App Home"
          type: "home",
          blocks,
        },
      });
    } catch (err) {
      if (err.code) {
        if (err.code === "ENOTFOUND") {
          // return url is wrong
          return ack({
            response_action: "errors",
            errors: {
              instance_url:
                "The URL is not reachable. Please make sure it's valid.",
            },
          });
        }
        if (err.code === "ERR_BAD_REQUEST") {
          // return url is wrong
          return ack({
            response_action: "errors",
            errors: {
              client_id:
                "The Client ID doesn't seem to be correct. Please check it again.",
            },
          });
        }
      }

      console.error(err);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectServiceNow;
