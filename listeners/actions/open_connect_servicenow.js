const openConnectServicenow = async ({ body, client, logger }) => {
  try {
    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "connect_servicenow",
        title: {
          type: "plain_text",
          text: "Connect to ServiceNow ",
        },
        blocks: [
          {
            type: "input",
            block_id: "instance_url",
            element: {
              type: "plain_text_input",
              action_id: "instance_url-action",
              placeholder: {
                type: "plain_text",
                text: "https://sample_domain.service-now.com/",
              },
            },
            label: {
              type: "plain_text",
              text: "ServiceNow instance URL",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "input",
            block_id: "client_id",
            element: {
              type: "plain_text_input",
              action_id: "client_id-action",
              placeholder: {
                type: "plain_text",
                text: "Client ID generated with ServiceNow",
              },
            },
            label: {
              type: "plain_text",
              text: "OAuth Client ID",
              emoji: true,
            },
          },
          {
            type: "input",
            block_id: "client_secret",
            element: {
              type: "plain_text_input",
              action_id: "client_secret-action",
              placeholder: {
                type: "plain_text",
                text: "Client Secret generated within ServiceNow",
              },
            },
            label: {
              type: "plain_text",
              text: "OAuth Client Secret",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "_The Client ID and Client Secret are generated upon creation of an OAuth API endpoint for external clients within ServiceNow._",
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = openConnectServicenow;
