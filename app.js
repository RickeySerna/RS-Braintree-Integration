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
        verifyCard: true
      }
    }
  }, (error, result) => {
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
      title: 'Spooky Apple Pay!'
	  });
  });
});

app.post('/apple-pay-transaction', (req, res, next) => {

});

app.get('/3D-Secure', (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    res.render('3D-Secure', {
      clientToken: response.clientToken,
      title: 'Spooky 3D Secure!'
	  });
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