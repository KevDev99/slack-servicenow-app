const snowAuthRedirect = require("./snow_auth_redirect.js");

module.exports.registerRoutes = (receiver) => {
  snowAuthRedirect(receiver);
};
