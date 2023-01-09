const User = require("../../database/models/userModel.js");
const {
  dbInstallation,
} = require("../../database/models/installationModel.js");

const { connectedInstanceBody } = require("../events/app_home_opened.js");

const disconnectAccount = async ({ body, client, ack }) => {
  try {
    // remove user from Users table
    await User.deleteOne({ _id: body.user.id });

    // acknowledge request
    await ack();

    // get installation
    const installation = await dbInstallation.findById(body.team.id);

    // refresh view
    const blocks = await connectedInstanceBody(body.user.id, installation);

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
    console.error(err);
  }
};

module.exports = disconnectAccount;
