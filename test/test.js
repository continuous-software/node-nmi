var config = require('../config.js');
var factory = require('../index.js');
var assert = require('assert');
var GatewayError = require('42-cent-base').GatewayError;

describe('NMI adpator', function () {

    var service;

    beforeEach(function () {
        service = factory(config);
    });

    it('should submit transaction ', function (done) {
        var order = {
            amount: Math.random() * 100 + 1
        };

        var cc = {
            creditCardNumber: '4111111111111111',
            expirationYear: '17',
            expirationMonth: '01',
            cvv: '123'
        };
        var prospect = {
            customerFirstName: 'Ellen',
            customerLastName: 'Johson',
            billingAddress: '14 Main Street',
            billingCity: 'Pecan Springs',
            billingZip: '44628',
            billingState: 'TX',
            shippingFirstName: 'China',
            shippingLastName: 'Bayles',
            shippingAddress: '12 Main Street',
            shippingCity: 'Pecan Springs',
            shippingZip: '44628'
        };

        service.submitTransaction(order, cc, prospect)
            .then(function (result) {
                assert(result.transactionId, 'transaction should be defined');
                assert(result.authCode, 'authCode should be defined');
                assert(result._original, '_original should be defined');
                done();
            });
    });

    it('should reject the promise if gateway does not return appropriate result', function (done) {
        var order = {
            amount: Math.random() * 100 + 1
        };

        var cc = {
            creditCardNumber: '666',
            expirationYear: '17',
            expirationMonth: '01',
            cvv: '123'
        };
        var prospect = {
            customerFirstName: 'Ellen',
            customerLastName: 'Johson',
            billingAddress: '14 Main Street',
            billingCity: 'Pecan Springs',
            billingZip: '44628',
            billingState: 'TX',
            shippingFirstName: 'China',
            shippingLastName: 'Bayles',
            shippingAddress: '12 Main Street',
            shippingCity: 'Pecan Springs',
            shippingZip: '44628'
        };

        service.submitTransaction(order, cc, prospect)
            .then(function () {
                throw new Error('should not get here')
            }, function (err) {
                assert(err instanceof GatewayError);
                assert(err.message.indexOf('Invalid Credit Card Number') !== -1);
                assert(err._original, '_original should be defined');
                done();
            });
    });

});
