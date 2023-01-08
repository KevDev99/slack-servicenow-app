const events = require("./events");
const actions = require("./actions");
const commands = require("./commands");

module.exports.registerListeners = (app) => {
  events.register(app);
  actions.register(app);
  commands.register(app);
};
