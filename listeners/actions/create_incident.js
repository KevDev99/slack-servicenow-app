const createIncident = async ({ body, client, ack }) => {
  try {
    await ack();

    await client.views.open({
      // Pass a valid trigger_id within 3 seconds of receiving it
      trigger_id: body.trigger_id,
      // View payload
      view: {
        type: "modal",
        // View identifier
        callback_id: "submit_incident",
        title: {
          type: "plain_text",
          text: "Create an Incident",
        },
        blocks: [
          {
            type: "input",
            block_id: "short_description",
            element: {
              type: "plain_text_input",
              action_id: "short_description-action",
            },
            label: {
              type: "plain_text",
              text: "Short Description",
              emoji: true,
            },
          },
          {
            type: "input",
            optional: true,
            block_id: "description",
            element: {
              type: "plain_text_input",
              multiline: true,
              action_id: "description-action",
            },
            label: {
              type: "plain_text",
              text: "Description",
              emoji: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Create",
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

module.exports = createIncident;
