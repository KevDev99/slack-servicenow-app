const openConnectServicenow = require("./open_connect_servicenow.js");
const disconnectInstance = require("./disconnect_instance.js");
const connectAccount = require("./connect_account.js");

module.exports.register = (app) => {
  app.action("open_connect_servicenow", openConnectServicenow);
  app.action("disconnect_instance", disconnectInstance);
  app.action("connect_account", connectAccount);
};
