const { appHomeOpened } = require("./app_home_opened.js");
const connectServiceNow = require("./connect_servicenow.js");
const submitDisconnect = require("./submit_disconnect.js");
const submitIncident = require("./submit_incident.js");

module.exports.register = (app) => {
  app.event("app_home_opened", appHomeOpened);
  app.view("connect_servicenow", connectServiceNow);
  app.view("submit_disconnect", submitDisconnect);
  app.view("submit_incident", submitIncident);

};
