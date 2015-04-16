var utils = require('util');
var assert = require('assert');
var base = require('42-cent-base').BaseGateway;
var Promise = require('bluebird');
var request = require('request');
var mapKeys = require('42-cent-util').mapKeys;
var qs = require('query-string');
var GatewayError = require('42-cent-base').GatewayError;

var schema = require('./schemas.js');

/**
 * @extends BaseGateway
 * @param config
 * @constructor
 */
function NMIGateway (config) {

  assert(config.USERNAME, 'USERNAME must be defined');
  assert(config.PASSWORD, 'PASSWORD must be defined');

  this.endpoint = 'https://secure.nmi.com/api/transact.php';

  utils._extend(this, config);
}


function postRequest (params, service) {

  var post = Promise.promisify(request.post);

  params.username = service.USERNAME;
  params.password = service.PASSWORD;

  return post(service.endpoint, {formData: params}).then(function (result) {
    return qs.parse('?' + result[1]);
  });
}

utils.inherits(NMIGateway, base);

/**
 * @inheritsDoc
 */
NMIGateway.prototype.submitTransaction = function submitTransaction (order, creditCard, prospect, other) {

  var params = {};

  utils._extend(params, order);
  utils._extend(params, creditCard);
  utils._extend(params, prospect);

  params = mapKeys(params, schema);

  utils._extend(params, other);

  params.type = 'sale';
  if (creditCard.expirationMonth && creditCard.expirationYear) {
    params.ccexp = creditCard.expirationMonth.toString() + creditCard.expirationYear.toString();
  }
  return postRequest(params, this).then(function (result) {

    if (result.response !== '1') {
      throw new GatewayError(result.responsetext, result);
    }

    return {
      transactionId: result.transactionid,
      _original: result,
      authCode: result.authcode
    }
  });

};

/**
 * @inheritsDoc
 */
NMIGateway.prototype.authorizeTransaction = function authorizeTransaction (order, creditCard, prospect, other) {
  var params = {};

  if (other) {
    console.log('other field is not supported');
  }

  utils._extend(params, order);
  utils._extend(params, creditCard);
  utils._extend(params, prospect);

  params = mapKeys(params, schema);

  params.type = 'auth';
  params.ccexp = creditCard.expirationMonth.toString() + creditCard.expirationYear.toString();
  return postRequest(params, this).then(function (result) {

    if (result.response !== '1') {
      throw new GatewayError(result.responsetext, result);
    }

    return {
      transactionId: result.transactionid,
      _original: result,
      authCode: result.authcode
    }
  });
};

/**
 * @inheritsDoc
 */
NMIGateway.prototype.refundTransaction = function refundTransaction (transactionId, options) {

  var params = {
    transactionid: transactionId
  };
  options = options || {};

  utils._extend(params, options);

  params.type = 'refund';

  return postRequest(params, this).then(function (result) {

    if (result.response !== '1') {
      throw new GatewayError(result.responsetext, result);
    }

    return {
      _original: result
    }
  });


};

/**
 * @inheritsDoc
 */
NMIGateway.prototype.voidTransaction = function voidTransaction (transId, options) {

  if (options) {
    console.log('options is not supported');
  }

  var params = {
    transactionid: transId
  };

  params.type = 'void';

  return postRequest(params, this)
    .then(function (result) {
      if (result.response !== '1') {
        throw new GatewayError(result.responsetext, result);
      }

      return {
        _original: result
      };
    });
};

/**
 * @inheritsDoc
 */
NMIGateway.prototype.createCustomerProfile = function createCustomerProfile (cc, billing, shipping, options) {

  var params = {};
  var scheme = utils._extend(schema, {customerFirstName: 'first_name', customerLastName: 'last_name'});


  utils._extend(params, cc);
  utils._extend(params, billing);
  utils._extend(params, shipping);

  params = mapKeys(params, scheme);

  utils._extend(params, options);

  params.customer_vault = 'add_customer';
  params.ccexp = cc.expirationMonth.toString() + cc.expirationYear.toString();
  return postRequest(params, this).then(function (result) {

    if (result.response !== '1') {
      throw new GatewayError(result.responsetext, result);
    }

    return {
      profileId: result.customer_vault_id,
      _original: result
    }
  });
};

/**
 * @inheritsDoc
 */
NMIGateway.prototype.chargeCustomer = function (order, prospect, other) {
  return this.submitTransaction(order, {}, prospect, other);
};

module.exports = NMIGateway;
