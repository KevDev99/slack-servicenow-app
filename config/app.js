const { App } = require("@slack/bolt");

const receiver = require("./receiver.js");

const app = new App({
  receiver: receiver,
});

module.exports = app;
