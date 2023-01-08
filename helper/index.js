const { getUser, getUsers } = require("../database/db.js");

// formats the incoming state object from slack to a useful object
const formatState = (unformatted_state) => {
  const formatted_state = {};

  for (const parentkeyIndex in Object.keys(unformatted_state)) {
    const parentKey = Object.keys(unformatted_state)[parentkeyIndex];

    formatted_state[parentKey] =
      unformatted_state[parentKey][`${parentKey}-action`].value;
  }

  return formatted_state;
};

const formatMessageState = (state) => {
  const formattedObj = {};
  const keys = Object.keys(state.values);
  keys.map((key) => {
    const subKey = Object.keys(state.values[key])[0];

    console.log(state.values[key][subKey]);

    if (state.values[key][subKey].type === "channels_select") {
      formattedObj.channels_select = state.values[key][subKey].selected_channel;
    }

    if (state.values[key][subKey].type === "static_select") {
      formattedObj.static_select =
        state.values[key][subKey].selected_option.value;
    }
    if (state.values[key][subKey].type === "plain_text_input") {
      formattedObj.plain_text_input = state.values[key][subKey].value;
    }
  });

  return formattedObj;
};

const insertAt = (array, index, ...elementsArray) => {
  array.splice(index, 0, ...elementsArray);
};

async function getUserFromTextBody(textParts, client) {
  try {
    let user;

    const members = await getUsers();

    textParts.map((textPart) => {
      const handledByFields = textPart.split(" ");

      const validFilterField = [];

      handledByFields.map((field) => {
        const filteredMembers = members.filter((member) =>
          member.user.name.includes(field)
        );

        if (filteredMembers.length >= 1) {
          return validFilterField.push(field);
        }
      });

      const foundMembers = [];

      members.map((member) => {
        let matchYN = new RegExp(validFilterField.join("|")).test(
          member.user.name
        );

        if (matchYN) {
          foundMembers.push(member);
        }
      });
      user = foundMembers[0];
    });

    return user;
  } catch (error) {
    console.error(error);
  }
}

async function setUserStatus(
  client,
  user,
  statusText,
  statusEmoji,
  statusExpirationUnix
) {
  try {
    // check if user exists in db
    const dbUser = await getUser(user.id);

    // if user is not in db - send notification to authenticate the app
    if (!dbUser) {
      return console.log("User not in db", user);
      // TODO: send notification to authenticate the app
    }

    const statusObj = {
      status_text: statusText,
      status_emoji: statusEmoji,
    };

    if (statusExpirationUnix) {
      statusObj.status_expiration = statusExpirationUnix;
    }

    console.log(statusObj);

    // set status for user
    const { ok, error, profile } = await client.users.profile.set({
      token: dbUser.user.token,
      profile: statusObj,
    });

    if (!ok) throw error;
  } catch (err) {
    console.error(err);
  }
}

function getTimestampInSeconds(date, minutes = 0) {
  // check if minutes need to be added
  let timestampDate = new Date(date.getTime() + minutes * 60000);

  return Math.floor(timestampDate / 1000);
}

module.exports = {
  formatState,
  formatMessageState,
  getUserFromTextBody,
  setUserStatus,
  getTimestampInSeconds,
};
