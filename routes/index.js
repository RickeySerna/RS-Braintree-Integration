var express = require('express');
var router = express.Router();
const braintree = require('braintree');

/* const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  // Use your own credentials from the sandbox Control Panel here
  merchantId: 'pzrgxphnvtycmdhq',
  publicKey: '932hj9f244t2bf6f',
  privateKey: '74a190cdf990805edd5a329d5bff37c0'
});*/

/* GET home page. */

//router.get('/', function(req, res, next) {
  /*gateway.clientToken.generate({}, (err, response) => {
    res.render('index', {
      clientToken: response.clientToken,
      title: 'Express'
	  });
  });*/
//});


module.exports = router;