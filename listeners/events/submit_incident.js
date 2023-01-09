const { formatState } = require("../../helper");
const { refreshToken } = require("../../api/index");
const {
  dbInstallation,
} = require("../../database/models/installationModel.js");
const axios = require("axios");

const submitIncident = async ({ body, client, logger, ack }) => {
  try {
    ack();

    // format body state
    const state = formatState(body.view.state.values);

    // refresh token
    const accessToken = await refreshToken(body.user.id);

    // installation
    const installation = await dbInstallation.findById(body.team.id);

    // set payload
    const payload = {
      short_description: state.short_description,
    };

    if (state.description && state.description !== "") {
      payload.description = state.description;
    }

    // create incident
    const res = await axios.post(
      `${installation.servicenow.instance_url}/api/now/table/incident`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (res.status !== 201) throw "Error with service now API";

    const resBody = res.data.result;

    const ticketUrl = `${installation.servicenow.instance_url}/nav_to.do?uri=/incident.do?sys_id=${resBody.sys_id}`;

    // reply to user
    client.chat.postMessage({
      channel: body.user.id,
      text: "🆕 ticket has been created",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🆕 ticket has been created: <${ticketUrl}|${resBody.number}>*`,
          },
        },
      ],
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = submitIncident;
