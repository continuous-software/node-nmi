var Gateway = require('./lib/NMIGateway.js');
module.exports = function (config) {
    return new Gateway(config);
}
