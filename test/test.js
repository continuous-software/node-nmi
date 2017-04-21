var config = require('../config.js');
var factory = require('../index.js');
var assert = require('assert');
var GatewayError = require('42-cent-base').GatewayError;
var CreditCard = require('42-cent-model').CreditCard;
var Prsopect = require('42-cent-model').Prospect;

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
        expirationYear: '20',
        expirationMonth: '01',
        cvv: '999'
      };
      var prospect = {
        customerFirstName: 'Ellen',
        customerLastName: 'Johnson',
        billingAddress: 'Address 1',
        billingCity: 'Pecan Springs',
        billingZip: '12345',
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
        expirationYear: '20',
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

  describe('authorize transaction', function () {

    it('should authorize a transaction ', function (done) {
      var order = {
        amount: Math.random() * 100 + 1
      };

      var cc = {
        creditCardNumber: '4111111111111111',
        expirationYear: '20',
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

      service.authorizeTransaction(order, cc, prospect)
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
        expirationYear: '20',
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

      service.authorizeTransaction(order, cc, prospect)
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
        expirationYear: '20',
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

    it('should support partial refund', function (done) {
      var order = {
        amount: Math.random() * 100 + 1
      };

      var cc = {
        creditCardNumber: '4111111111111111',
        expirationYear: '20',
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

          return service.refundTransaction(transId, {amount: 0.1 * order.amount});
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

  describe('void transaction', function () {
    it('should void a transaction', function (done) {
      var order = {
        amount: Math.random() * 100 + 1
      };

      var cc = {
        creditCardNumber: '4111111111111111',
        expirationYear: '20',
        expirationMonth: '01',
        cvv: '123'
      };

      var transId;
      service.submitTransaction(order, cc)
        .then(function (result) {
          transId = result.transactionId;
          return service.voidTransaction(transId);
        })
        .then(function (response) {
          assert(response._original, '_original should be defined');
          done();
        });
    });

    it('should reject the promise when the gateway returns error', function (done) {
      service.voidTransaction(666)
        .then(function (res) {
          throw new Error('should not get here');
        }, function (err) {
          assert(err instanceof GatewayError);
          assert(err.message.indexOf('Transaction not found') !== -1);
          assert(err._original, '_original should be defined');
          done();
        })
    });
  });

  describe('create customer', function () {

    it('should create a customer profile', function (done) {

      var cc = new CreditCard()
        .withCreditCardNumber('4111111111111111')
        .withExpirationMonth('12')
        .withExpirationYear('2014')
        .withCvv('123');

      var billing = {
        customerFirstName: 'bob',
        customerLastName: 'leponge',
        email: 'bob@eponge.com'
      };

      service.createCustomerProfile(cc, billing)
        .then(function (result) {
          assert(result.profileId, ' profileId Should be defined');
          assert(result._original, '_original should be defined');
          done();
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    it('should reject the promise when the gateway return an error', function (done) {
      var cc = new CreditCard()
        .withCreditCardNumber('411111111111')
        .withExpirationMonth('12')
        .withExpirationYear('2009')
        .withCvv('123');

      var billing = {
        customerFirstName: 'bob',
        customerLastName: 'leponge',
        email: 'bob@eponge.com'
      };

      service.createCustomerProfile(cc, billing)
        .then(function (result) {
          throw new Error('it should not get here');
        }, function (err) {
          assert(err._original, '_original should be defined');
          assert(err.message.indexOf('Invalid Credit Card Number') != -1);
          done();
        });
    });
  });

  describe('charge customer profile', function () {


    it('should charge a existing customer', function (done) {

      var random = Math.floor(Math.random() * 1000);


      var cc = new CreditCard()
        .withCreditCardNumber('4111111111111111')
        .withExpirationMonth('12')
        .withExpirationYear('2014')
        .withCvv('123');

      var billing = {
        customerFirstName: 'bob',
        customerLastName: 'leponge',
        email: random + 'bob@eponge.com'
      };

      service.createCustomerProfile(cc, billing)
        .then(function (result) {
          var randomAmount = Math.floor(Math.random() * 300);
          assert(result.profileId, ' profileId Should be defined');
          assert(result._original, '_original should be defined');

          return service.chargeCustomer({amount: randomAmount}, {profileId: result.profileId});
        })
        .then(function (res) {
          assert(res.transactionId, 'transactionId should be defined');
          assert(res._original, '_original should be defined');
          done();
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    it('should reject the promise when the gateway return an error', function (done) {
      return service.chargeCustomer({amount: 234}, {profileId: 'invalid'})
        .then(function () {
          done('should not get here');
        }, function (err) {
          assert(err._original, '_original should be defined');
          assert(err.message.indexOf('Invalid Customer Vault ID specified') !== -1, 'should have the gateway response in the message');
          done();
        }
      );
    });
  });


});
