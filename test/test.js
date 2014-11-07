var config = require('../config.js');
var factory = require('../index.js');
var assert = require('assert');
var GatewayError = require('42-cent-base').GatewayError;

describe('NMI adpator', function () {

    var service;

    beforeEach(function () {
        service = factory(config);
    });


    describe('submitting transaction', function () {

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

    describe('refunding transaction', function () {

        it('should refund an already settled transaction', function (done) {
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

            var transId;

            service.submitTransaction(order, cc, prospect)
                .then(function (result) {

                    var transId = result.transactionId;

                    return service.refundTransaction(transId);
                })
                .then(function (result) {
                    assert(result._original, 'original should be defined');
                    done();
                });
        });

        it('should reject the promise if the gateway does not return appropriate result', function (done) {
            service.refundTransaction('666')
                .then(function (result) {
                    throw new Error('should not get here');
                }, function (err) {
                    assert(err instanceof GatewayError);
                    assert(err.message.indexOf('Transaction not found') !== -1);
                    assert(err._original, '_original should be defined');
                    done();
                })
        })

    });


});
