const ticket = require("./ticket.js");

module.exports.register = (app) => {
  app.command("/ticket", ticket);
};
