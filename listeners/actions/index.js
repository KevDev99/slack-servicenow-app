const openConnectServicenow = require("./open_connect_servicenow.js");
const disconnectInstance = require("./disconnect_instance.js");
const connectAccount = require("./connect_account.js");
const disconnectAccount = require("./disconnect_account.js");
const createIncident = require("./create_incident.js");

module.exports.register = (app) => {
  app.action("open_connect_servicenow", openConnectServicenow);
  app.action("disconnect_instance", disconnectInstance);
  app.action("connect_account", connectAccount);
  app.action("disconnect_account", disconnectAccount);
  app.shortcut("create_incident", createIncident)
};
