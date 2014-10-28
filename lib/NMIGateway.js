var utils = require('util');
var assert = require('assert');
var base = require('42-cent-base').BaseGateway;
var Promise = require('bluebird');
var request = require('request');
var mapKeys = require('42-cent-base').mapKeys;
var qs = require('query-string');
var GatewayError = require('42-cent-base').GatewayError;

var schema = {
    amount: 'amount',
    creditCardNumber: 'ccnumber',
    cvv: 'cvv',
    customerFirstName: 'firstname',
    customerLastName: 'lastname',
    customerEmail: 'email',
    billingAddress: 'address1',
    billingCity: 'city',
    billingState: 'state',
    billingZip: 'zip',
    billingCountry: 'country',
    shippingFirstName: 'shipping_firstname',
    shippingLastName: 'shipping_lastname',
    shippingAddress: 'shipping_address1',
    shippingCity: 'shipping_city',
    shippingState: 'shipping_state',
    shippingZip: 'shipping_zip',
    shippingCountry: 'shipping_country'
};

function NMIGateway(config) {

    assert(config.USERNAME, 'USERNAME must be defined');
    assert(config.PASSWORD, 'PASSWORD must be defined');

    this.endpoint = 'https://secure.nmi.com/api/transact.php';

    utils._extend(this, config);
}


function postRequest(params, service) {

    var post = Promise.promisify(request.post);

    params.username = service.USERNAME;
    params.password = service.PASSWORD;

    return post(service.endpoint, {formData: params}).then(function (result) {
        return qs.parse('?' + result[1]);
    });
}

utils.inherits(NMIGateway, base);


NMIGateway.prototype.submitTransaction = function submitTransaction(order, creditCard, prospect, other) {

    var params = {};

    if (other) {
        console.log('other field is not supported');
    }

    utils._extend(params, order);
    utils._extend(params, creditCard);
    utils._extend(params, prospect);

    params = mapKeys(params, schema);

    params.type = 'sale';
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

module.exports = NMIGateway;
