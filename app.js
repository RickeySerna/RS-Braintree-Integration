const gateway = require('./gatewaycreate.js');
const express = require('express');
const braintree = require("braintree");
const date = require('date-utils');
const path = require('path')
const stream = require('stream');
const readable = require('stream').Readable;
//const exphbs = require('express-handlebars')
//const session = require('express-session')
var createError = require('http-errors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var io = require("./socketapi.js");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.render('index', {
      clientToken: response.clientToken,
      title: 'BOO!'
	  });
  });
});

app.post('/transaction-with-token', (req, res, next) => {
  const PaymentMethodNonce = req.body.PaymentMethodNonce;
  // Using toFixed to round the amount after the second decimal. So if a long floating point is entered, it's cut off at the 2nd decimal.
  const amountFromClient = Number(req.body.amount).toFixed(2);
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phoneNumber;
  const DeviceDataString = req.body.DeviceDataString;

  console.log("Nonce in the server, token checkout: " + PaymentMethodNonce);
  console.log("Device data string in server, token checkout: " + DeviceDataString);

  const thisCustomer = gateway.customer.create({
    firstName: first,
    lastName: last,
    email: email,
    phone: phone,
    paymentMethodNonce:PaymentMethodNonce,
    creditCard: {
      options: {
        verifyCard: true,
        verificationAmount: "1"
      }
    },
    deviceData: DeviceDataString
  }, (error, result) => {
    if (error) {
      console.error(error);
    }
    if (result.success == true) {
      let cusResponseObject = result;
      gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodToken: result.customer.creditCards[0].token,
        options: {
          // This option requests the funds from the transaction
          // once it has been authorized successfully
          submitForSettlement: true
        },
        deviceData: DeviceDataString
      }, (error, result) => {
        if (error) {
          console.error(error);
        }
        console.log("Transaction ID: " + result.transaction.id);
        console.log("Transaction status: " + result.transaction.status);
        if (result.success == true) {
          console.log("Successful transaction status: " + result.transaction.status);
          res.render('success', {transactionResponse: result, cusResponseObject: cusResponseObject});
        } else {
          if (result.transaction.status == "processor_declined") {
            console.log("Declined transaction status: " + result.transaction.status);
            res.render('processordeclined', {transactionResponse: result, cusResponseObject: cusResponseObject});
          }
          else {
            console.log("Failed transaction status: " + result.transaction.status);
            res.render('failed', {transactionResponse: result, cusResponseObject: cusResponseObject});
          }
        }
      });
    } else {
      res.json(result);
    };
  });
});

app.post('/transaction-with-nonce', (req, res, next) => {
  const PaymentMethodNonce = req.body.PaymentMethodNonce;
  // Using toFixed to round the amount after the second decimal. So if a long floating point is entered, it's cut off at the 2nd decimal.
  const amountFromClient = Number(req.body.amount).toFixed(2);
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phoneNumber;
  const DeviceDataString = req.body.DeviceDataString;

  console.log("Nonce in the server, nonce checkout: " + PaymentMethodNonce);
  console.log("Device data string in server, nonce checkout: " + DeviceDataString);

  const thisTransaction = gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: PaymentMethodNonce,
    customer: {
      firstName: first,
      lastName: last,
      phone: phone,
      email: email
    },
    options: {
      submitForSettlement: true
    },
    deviceData: DeviceDataString
  }, (error, result) => {
    if (error) {
      console.error(error);
    }
    console.log("Transaction ID: " + result.transaction.id);
    if (result.success) {
      console.log("Successful transaction status: " + result.transaction.status);
      res.render('success', {transactionResponse: result, title: 'Success!'});
    } else {
      if (result.transaction.status == "processor_declined") {
        console.log("Declined transaction status: " + result.transaction.status);
        res.render('processordeclined', {transactionResponse: result});
      } else {
        console.log("Failed transaction status: " + result.transaction.status);
        res.render('failed', {transactionResponse: result});
      }
    }
  });
});

app.get('/3D-Secure', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.render('3D-Secure', {
      clientToken: response.clientToken,
      title: 'Spooky 3D Secure!'
	  });
  });
});

app.post('/3DS-transaction-with-nonce', (req, res, next) => {
  const PaymentMethodNonce = req.body.PaymentMethodNonce;
  // Using toFixed to round the amount after the second decimal. So if a long floating point is entered, it's cut off at the 2nd decimal.
  const amountFromClient = Number(req.body.amount).toFixed(2);
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phoneNumber;
  const streetAddress = req.body.streetAddress;
  const adtlAddress = req.body.additionalAddress;
  const city = req.body.cityName;
  const region = req.body.regionCode;
  const postCode = req.body.postalCode;
  const country = req.body.countryCode;
  const DeviceDataString = req.body.DeviceDataString;

  console.log("Nonce in the server, 3DS nonce checkout: " + PaymentMethodNonce);
  console.log("Device data string in server, 3DS nonce checkout: " + DeviceDataString);

  const thisTransaction = gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: PaymentMethodNonce,
    customer: {
      firstName: first,
      lastName: last,
      phone: phone,
      email: email
    },
    billing: {
      firstName: first,
      lastName: last,
      streetAddress: streetAddress,
      extendedAddress: adtlAddress,
      locality: city,
      region: region,
      postalCode: postCode,
      countryCodeAlpha2: country
    },
    shipping: {
      firstName: first,
      lastName: last,
      streetAddress: streetAddress,
      extendedAddress: adtlAddress,
      locality: city,
      region: region,
      postalCode: postCode,
      countryCodeAlpha2: country
    },
    options: {
      submitForSettlement: true
    },
    deviceData: DeviceDataString,
  }, (error, result) => {
    if (error) {
      console.error(error);
    }
    console.log("Transaction ID: " + result.transaction.id);
    if (result.success) {
      console.log("Successful transaction status: " + result.transaction.status);
      res.render('success', {transactionResponse: result, title: 'Success!'});
    } else {
      if (result.transaction.status == "processor_declined") {
        console.log("Declined transaction status: " + result.transaction.status);
        res.render('processordeclined', {transactionResponse: result});
      } else {
        console.log("Failed transaction status: " + result.transaction.status);
        res.render('failed', {transactionResponse: result});
      }
    }
  });
});

app.post('/3DS-transaction-with-token', (req, res, next) => {
  const PaymentMethodNonce = req.body.PaymentMethodNonce;
  // Using toFixed to round the amount after the second decimal. So if a long floating point is entered, it's cut off at the 2nd decimal.
  const amountFromClient = Number(req.body.amount).toFixed(2);
  const first = req.body.firstName;
  const last = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phoneNumber;
  const streetAddress = req.body.streetAddress;
  const adtlAddress = req.body.additionalAddress;
  const city = req.body.cityName;
  const region = req.body.regionCode;
  const postCode = req.body.postalCode;
  const country = req.body.countryCode;
  const DeviceDataString = req.body.DeviceDataString;
  

  console.log("Nonce in the server, 3DS token checkout: " + PaymentMethodNonce);
  console.log("Device data string in server, 3DS token checkout: " + DeviceDataString);

  const thisCustomer = gateway.customer.create({
    firstName: first,
    lastName: last,
    email: email,
    phone: phone,
    paymentMethodNonce:PaymentMethodNonce,
    deviceData: DeviceDataString,
    creditCard: {
      billingAddress: {
        firstName: first,
        lastName: last,
        streetAddress: streetAddress,
        extendedAddress: adtlAddress,
        locality: city,
        region: region,
        countryCodeAlpha2: country,
        postalCode: postCode
      },
      options: {
        verifyCard: true,
        verificationAmount: "1"
      }
    }
  }, (error, result) => {
    if (result.success == true) {
      let cusResponseObject = result;
      // In order for 3DS to apply to the transaction after vaulting, we need to generate a new nonce from the newly created token
      // Then we'll pass that back to the client to be run through verifyCard() again.
      gateway.paymentMethodNonce.create(result.customer.creditCards[0].token, async function(err, response) {
        if (response.success == true) {
          // Here is our new nonce.
          const nonceGeneratedFromToken = response.paymentMethodNonce.nonce;
          console.log("Nonce generated from token: " + nonceGeneratedFromToken);

          // Using a function I defined in socketapi.js to send the nonce to 3D-Secure.hbs.
          // 3D-Secure.hbs has a socket open a listening for the event sendNonce() uses.
          // It'll receive the nonce, pass it into verifyCard(), then pass back the resulting 3DS-enriched nonce.
          io.sendNonce(nonceGeneratedFromToken);

          // This is where we're receiving the new 3DS-enriched nonce from 3D-Secure.hbs.
          // returnNonce() returns a variable. That variable is a Promise which includes a socket to receive the nonce back from the client.
          // We use async/await here to allow the Promise to resolve and thus allow the nonce to actually populate the variable before it's returned here.
          let new3DSenrichedNonceFromClient = await io.returnNonce();
          console.log("Nonce from the second verifyCard() call, received from the client via a socket: " + new3DSenrichedNonceFromClient);
/*
          // Now we've got the nonce, let's create the transaction!
          gateway.transaction.sale({
            amount: amountFromClient,
            paymentMethodNonce: new3DSenrichedNonceFromClient,
            options: {
              // This option requests the funds from the transaction
              // once it has been authorized successfully
              submitForSettlement: true
            },
            deviceData: DeviceDataString
          }, (error, result) => {
            console.log("Transaction ID: " + result.transaction.id);
            console.log("Transaction status: " + result.transaction.status);
            if (result.success == true) {
              console.log("Successful transaction status: " + result.transaction.status);
              res.render('success', {transactionResponse: result, cusResponseObject: cusResponseObject});
            } else {
              if (result.transaction.status == "processor_declined") {
                console.log("Declined transaction status: " + result.transaction.status);
                res.render('processordeclined', {transactionResponse: result, cusResponseObject: cusResponseObject});
              }
              else {
                console.log("Failed transaction status: " + result.transaction.status);
                res.render('failed', {transactionResponse: result, cusResponseObject: cusResponseObject});
              }
            }
          });*/
        } else {
          res.json(response);
        }
      });
    } else {
      res.json(result);
    };
  });
});

app.get('/recent-transactions', (req, res) => {
  var threeMonthsAgo = Date.today().addMonths(-3);
  var txnSearchResults = [];
  var txnCount = 0;

  gateway.transaction.search(function (search) {
    search.createdAt().between(threeMonthsAgo, Date(Date.now()));
  }, function (err, response) {
      response.each(function (err, transaction) {
        txnSearchResults.push(transaction);
        txnCount += 1;
    });
  });

  function createTable() {
    setTimeout(function() {
      txnSearchResults.sort(function(a, b) {
        if (a.createdAt > b.createdAt) {
          return -1 // Move a lower in the array.
        }
        else if (a.createdAt < b.createdAt) {
          return 1 // Move b lower in the array.
        }
        else {
          return 0 // Equal dates! Move nothing.
        }
      });
      res.render('recent-transactions', {txnSearchResults: txnSearchResults, txnCount: txnCount});
    }, 10000);
  };

  createTable();
});

app.get('/ApplePay', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.render('ApplePay', {
      clientToken: response.clientToken,
      title: 'AHHHHH!pple Pay'
	  });
  });
});

app.post('/apple-pay-transaction', (req, res, next) => {

});

app.get('/GooglePay', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.render('GooglePay', {
      clientToken: response.clientToken,
      title: 'Ghoulgle Pay'
	  });
  });
});

app.post('/google-pay-transaction-with-nonce', (req, res, next) => {
  const GPPaymentMethodNonce = req.body.GPPaymentMethodNonce;
  const amountFromClient = Number(req.body.amount).toFixed(2);
  const DeviceDataString = req.body.DeviceDataString;
  // Decoding the encoded payment data from client/Google.
  const GPPaymentData = JSON.parse(req.body.GPPaymentData);

  console.log("Amount from GP client: " + amountFromClient);
  console.log("GP nonce in the server, nonce checkout: " + GPPaymentMethodNonce);
  // Making sure that the object was properly decoded.
  console.log("Address from payment data in server: " + GPPaymentData.paymentMethodData.info.billingAddress.address1);

  const thisGooglePayTransaction = gateway.transaction.sale({
    amount: amountFromClient,
    paymentMethodNonce: GPPaymentMethodNonce,
    customer: {
      // Google Pay just includes the full name as one variable, so these functions will extract the first and last names from that full name string.
      firstName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(0, GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ')),
      lastName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ') + 1),
      // Google is being rather annoying and throwing an error on the client when I require a phone number, so I'm hardcoding a number in instead.
      phone: "248-434-5508",
      email: GPPaymentData.email
    },
    billing: {
      firstName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(0, GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ')),
      lastName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ') + 1),
      streetAddress: GPPaymentData.paymentMethodData.info.billingAddress.address1,
      extendedAddress: GPPaymentData.paymentMethodData.info.billingAddress.address2,
      locality: GPPaymentData.paymentMethodData.info.billingAddress.locality,
      region: GPPaymentData.paymentMethodData.info.billingAddress.administrativeArea,
      postalCode: GPPaymentData.paymentMethodData.info.billingAddress.postalCode,
      countryCodeAlpha2: GPPaymentData.paymentMethodData.info.billingAddress.countryCode
    },
    shipping: {
      firstName: (GPPaymentData.shippingAddress.name).substring(0, GPPaymentData.shippingAddress.name.indexOf(' ')),
      lastName: (GPPaymentData.shippingAddress.name).substring(GPPaymentData.shippingAddress.name.indexOf(' ') + 1),
      streetAddress: GPPaymentData.shippingAddress.address1,
      extendedAddress: GPPaymentData.shippingAddress.address2,
      locality: GPPaymentData.shippingAddress.locality,
      region: GPPaymentData.shippingAddress.administrativeArea,
      postalCode: GPPaymentData.shippingAddress.postalCode,
      countryCodeAlpha2: GPPaymentData.shippingAddress.countryCode
    },
    options: {
      submitForSettlement: true
    },
    deviceData: DeviceDataString
  }, (error, result) => {
    console.log("Transaction ID: " + result.transaction.id);
    if (result.success) {
      console.log("Successful transaction status: " + result.transaction.status);
      res.render('success', {transactionResponse: result, title: 'Success!'});
    } else {
      if (result.transaction.status == "processor_declined") {
        console.log("Declined transaction status: " + result.transaction.status);
        res.render('processordeclined', {transactionResponse: result});
      } else {
        console.log("Failed transaction status: " + result.transaction.status);
        res.render('failed', {transactionResponse: result});
      }
    }
  });
});

app.post('/google-pay-transaction-with-token', (req, res, next) => {
  const GPPaymentMethodNonce = req.body.GPPaymentMethodNonce;
  const amountFromClient = Number(req.body.amount).toFixed(2);
  const DeviceDataString = req.body.DeviceDataString;
  // Decoding the encoded payment data from client/Google.
  const GPPaymentData = JSON.parse(req.body.GPPaymentData);

  console.log("Amount from GP client: " + amountFromClient);
  console.log("GP nonce in the server, token checkout: " + GPPaymentMethodNonce);
  // Making sure that the object was properly decoded.
  console.log("Address from payment data in server: " + GPPaymentData.paymentMethodData.info.billingAddress.address1);

  const thisCustomer = gateway.customer.create({
    firstName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(0, GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ')),
    lastName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ') + 1),
    email: GPPaymentData.email,
    phone: "248-434-5508",
    paymentMethodNonce: GPPaymentMethodNonce,
    creditCard: {
      billingAddress: {
        firstName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(0, GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ')),
        lastName: (GPPaymentData.paymentMethodData.info.billingAddress.name).substring(GPPaymentData.paymentMethodData.info.billingAddress.name.indexOf(' ') + 1),
        streetAddress: GPPaymentData.paymentMethodData.info.billingAddress.address1,
        extendedAddress: GPPaymentData.paymentMethodData.info.billingAddress.address2,
        locality: GPPaymentData.paymentMethodData.info.billingAddress.locality,
        region: GPPaymentData.paymentMethodData.info.billingAddress.administrativeArea,
        postalCode: GPPaymentData.paymentMethodData.info.billingAddress.postalCode,
        countryCodeAlpha2: GPPaymentData.paymentMethodData.info.billingAddress.countryCode
      }
    }
  }, (error, result) => {
    if (error) {
      console.error(error);
    }
    if (result.success == true) {
      let cusResponseObject = result;
      console.log("Google Pay token: " + result.customer.androidPayCards[0].token);
      gateway.transaction.sale({
        amount: amountFromClient,
        paymentMethodToken: result.customer.androidPayCards[0].token,
        shipping: {
          firstName: (GPPaymentData.shippingAddress.name).substring(0, GPPaymentData.shippingAddress.name.indexOf(' ')),
          lastName: (GPPaymentData.shippingAddress.name).substring(GPPaymentData.shippingAddress.name.indexOf(' ') + 1),
          streetAddress: GPPaymentData.shippingAddress.address1,
          extendedAddress: GPPaymentData.shippingAddress.address2,
          locality: GPPaymentData.shippingAddress.locality,
          region: GPPaymentData.shippingAddress.administrativeArea,
          postalCode: GPPaymentData.shippingAddress.postalCode,
          countryCodeAlpha2: GPPaymentData.shippingAddress.countryCode
        },
        options: {
          submitForSettlement: true
        },
        deviceData: DeviceDataString
      }, (error, result) => {
        if (error) {
          console.error(error);
        }
        console.log("Transaction ID: " + result.transaction.id);
        console.log("Transaction status: " + result.transaction.status);
        if (result.success == true) {
          console.log("Successful transaction status: " + result.transaction.status);
          res.render('success', {transactionResponse: result, cusResponseObject: cusResponseObject});
        } else {
          if (result.transaction.status == "processor_declined") {
            console.log("Declined transaction status: " + result.transaction.status);
            res.render('processordeclined', {transactionResponse: result, cusResponseObject: cusResponseObject});
          }
          else {
            console.log("Failed transaction status: " + result.transaction.status);
            res.render('failed', {transactionResponse: result, cusResponseObject: cusResponseObject});
          }
        }
      });
    } else {
      res.json(result);
    };
  });
});

app.get('/testing', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.render('testing', {
      clientToken: response.clientToken,
      title: 'API Testing'
	  });
  });
});

app.post('/testing-result', (req, res, next) => {
  const DeviceDataString = req.body.DeviceDataString;

  gateway.subscription.create({
    paymentMethodToken: "appleSubToken",
    planId: "guitStrings"
  }, (err, result) => {
    if (err) {
      console.error(err);
    }
    else {
      res.json(result);
    }
  });
});

// The checkout route
const checkout = require('./routes/checkout');
app.use('/checkout', checkout);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;