const express = require('express');
const router = express.Router();
const braintree = require('braintree');
/*
 router.post('/', (req, res, next) => {
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  // Use your own credentials from the sandbox Control Panel here
  merchantId: 'pzrgxphnvtycmdhq',
  publicKey: '932hj9f244t2bf6f',
  privateKey: '74a190cdf990805edd5a329d5bff37c0'
});


  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction for $10
  const newTransaction = gateway.transaction.sale({
    amount: 99.99,
    paymentMethodNonce: nonceFromTheClient,
    customerId: "cardS123",
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true,
      storeInVault: true
    }
  }, (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
  //console.log(newTransaction.credit_card_details.token);
  //newTransaction.credit_card_details.token;
}); */


module.exports = router;