const nodeCahed = require("node-cache");
const myChached = new nodeCahed();

// add whiteListing the cached
const addTokenToWhiteListhing = (token, data) => {
  myChached.set(token, data, 60 * 60);
};

// get the cached data from cached
const isTokenWhiteListing = (token) => {
  return myChached.get(token);
};

// remove the token of the whitelisting
const removeTokenwhiteListing = (token) => {
  myChached.del(token);
};

module.exports = {
  addTokenToWhiteListhing,
  isTokenWhiteListing,
  removeTokenwhiteListing,
};
