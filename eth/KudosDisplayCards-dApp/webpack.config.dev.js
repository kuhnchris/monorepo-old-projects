const config = require("./webpack.config.prod");
module.exports = config;
module.exports.mode = "development";
module.exports["devtool"] = 'inline-source-map';

