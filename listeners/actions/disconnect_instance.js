const disconnectInstance = async ({ body, client, logger }) => {
  try {
    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "submit_disconnect",
        title: {
          type: "plain_text",
          text: "Confirmation",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "This will disconnect all the users and remove all the existing alerts if there are any for this workspace. Are you sure you want to disconnect?",
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Do It",
        },
        close: {
          type: "plain_text",
          text: "Cancel",
          emoji: true,
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = disconnectInstance;
