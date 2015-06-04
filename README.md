[![Build Status](https://travis-ci.org/continuous-software/node-nmi.svg?branch=master)](https://travis-ci.org/continuous-software/node-nmi)

![node-nmi](http://www.pctechph.com/wp-content/uploads/2012/02/Network_Merchants.gif)

## Installation ##

    $ npm install -s nmi

## Usage

```javascript
var NMI = require('nmi');
var client = new NMI({
    USERNAME: '<PLACEHOLDER>',
    PASSWORD: '<PLACEHOLDER>'
});
```

## Gateway API

This SDK is natively compatible with [42-cent](https://github.com/continuous-software/42-cent).  
It implements the [BaseGateway](https://github.com/continuous-software/42-cent-base) API.
