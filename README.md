# RS Braintree Integration Demo

A comprehensive demonstration of Braintree payment integrations built with Node.js and Express. This application showcases multiple payment methods, 3D Secure authentication, real-time transaction monitoring, and analytics capabilities.

## Features

### Payment Methods
- **Credit/Debit Cards** - Standard card payments with tokenization support
- **Apple Pay** - Native Apple Pay integration
- **Google Pay** - Google Pay wallet integration
- **Venmo** - Venmo mobile payments
- **PayPal** - PayPal checkout and subscription support
- **Drop-in UI** - Braintree's pre-built payment UI

### Advanced Capabilities
- **3D Secure Authentication** - Enhanced security for card transactions
- **Tokenization** - Store payment methods for future use
- **Subscription Management** - Recurring payment support for multiple payment methods
- **Real-time Updates** - WebSocket-based transaction monitoring using Socket.IO
- **Analytics Dashboard** - Visual transaction data and reporting
- **Recent Transactions** - View and track payment history

## Tech Stack

- **Backend**: Node.js, Express.js
- **Payment Processing**: Braintree SDK
- **Real-time Communication**: Socket.IO
- **Template Engine**: Handlebars (HBS)
- **Development**: Nodemon for hot reloading

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Braintree Sandbox account

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RickeySerna/RS-Braintree-Integration.git
   cd RS-Braintree-Integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure your Braintree credentials**
   
   Create or update the `.env` file in the root directory with your Braintree sandbox credentials:
   ```env
   MERCHANT_ID=your_merchant_id
   PUBLIC_KEY=your_public_key
   PRIVATE_KEY=your_private_key
   ```

   These credentials can be found in your [Braintree Sandbox Dashboard](https://sandbox.braintreegateway.com/).

4. **Start the application**
   
   **Production mode:**
   ```bash
   npm start
   ```
   
   **Development mode** (with auto-reload):
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
RS-Braintree-Integration/
├── app.js                    # Main application file with route handlers
├── gatewaycreate.js         # Braintree gateway configuration
├── socketapi.js             # Socket.IO setup for real-time features
├── package.json             # Project dependencies
├── .env                     # Environment variables (not in git)
├── bin/
│   └── www                  # Application startup script
├── public/
│   └── stylesheets/         # CSS files
├── routes/
│   ├── index.js            # Main routes
│   ├── users.js            # User routes
│   └── checkout.js         # Checkout routes
└── views/                   # Handlebars templates
    ├── index.hbs           # Home page
    ├── 3D-Secure.hbs       # 3DS authentication
    ├── ApplePay.hbs        # Apple Pay integration
    ├── GooglePay.hbs       # Google Pay integration
    ├── Venmo.hbs           # Venmo integration
    ├── PayPal.hbs          # PayPal integration
    ├── Drop-in.hbs         # Drop-in UI
    ├── Analytics.hbs       # Analytics dashboard
    ├── recent-transactions.hbs  # Transaction history
    ├── success.hbs         # Success page
    ├── failed.hbs          # Failed transaction page
    └── testing.hbs         # Testing utilities
```

## API Endpoints

### Transaction Endpoints
- `POST /transaction-with-nonce` - Process card transaction with nonce
- `POST /transaction-with-token` - Process card transaction with saved token
- `POST /subscription` - Create subscription with card

### 3D Secure Endpoints
- `GET /3D-Secure` - 3D Secure authentication page
- `POST /3DS-transaction-with-nonce` - Process 3DS transaction
- `POST /3DS-transaction-with-token` - Process 3DS transaction with token
- `POST /3DS-subscription` - Create subscription with 3DS

### Alternative Payment Methods
- `POST /apple-pay-transaction-with-nonce` - Apple Pay transaction
- `POST /apple-pay-transaction-with-token` - Apple Pay with saved payment
- `POST /google-pay-transaction-with-nonce` - Google Pay transaction
- `POST /google-pay-transaction-with-token` - Google Pay with saved payment
- `POST /venmo-transaction-with-nonce` - Venmo transaction
- `POST /paypal-transaction` - PayPal transaction
- `POST /paypal-subscription` - PayPal subscription
- `POST /dropin-transaction` - Drop-in UI transaction

### Utility Endpoints
- `GET /recent-transactions` - View transaction history
- `GET /Analytics` - Analytics dashboard
- `GET /transactionDataForAnalytics` - Transaction data API

## Usage

1. **Testing Card Payments**: Navigate to the home page to test standard card transactions with various test card numbers
2. **3D Secure**: Use the 3D Secure page to test enhanced authentication flows
3. **Alternative Payments**: Test Apple Pay, Google Pay, Venmo, or PayPal from their respective pages
4. **Drop-in UI**: Use the Drop-in page for a quick all-in-one payment solution
5. **View Transactions**: Check the Recent Transactions page to see payment history
6. **Analytics**: View transaction insights and data visualizations on the Analytics page

## Development

- **Hot Reload**: Use `npm run dev` to run with nodemon for automatic server restarts
- **Logging**: The application uses Morgan for HTTP request logging and Chalk for colored console output
- **Real-time Updates**: Socket.IO provides real-time transaction status updates

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MERCHANT_ID` | Your Braintree merchant ID |
| `PUBLIC_KEY` | Your Braintree public key |
| `PRIVATE_KEY` | Your Braintree private key |

## Security Notes

- Never commit the `.env` file to version control
- Always use Sandbox credentials for development and testing
- Store production credentials securely using environment variables or secrets management
- The `.gitignore` file is configured to exclude sensitive files

## Testing

Use [Braintree's test card numbers](https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live) for testing:
- Visa: `4111111111111111`
- Mastercard: `5555555555554444`
- Amex: `378282246310005`

## License

This project is for demonstration and educational purposes.

## Author

Rickey Serna

## Support

For Braintree API documentation and support, visit:
- [Braintree Developer Docs](https://developer.paypal.com/braintree/docs)
- [Braintree Support](https://www.braintreepayments.com/support)
