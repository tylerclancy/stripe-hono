# Stripe Integration with Hono and Node.js

This project demonstrates a lightweight web server built with Hono and Node.js that integrates Stripe for payment processing. It includes a simple checkout process and webhook handling for Stripe events.

## Features

- Simple web server using Hono and Node.js
- Stripe Checkout integration
- Webhook handling for Stripe events
- Basic HTML page with a checkout button

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js installed on your local machine
- A Stripe account with API keys

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/tylerclancy/stripe-hono.git
   cd stripe-hono
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Stripe API keys:
   ```
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

## Usage

To start the server, run:

```
npm start
```

The server will start on `http://localhost:3000`.

### Endpoints

- `GET /`: Displays a simple HTML page with a checkout button
- `POST /checkout`: Creates a Stripe Checkout session
- `POST /webhook`: Handles Stripe webhook events
- `GET /success`: Success page for completed purchases
- `GET /cancel`: Cancellation page for abandoned purchases

## Stripe Integration

This project uses Stripe Checkout for payment processing. The main integration points are:

1. Creating a Checkout session in the `/checkout` endpoint
2. Handling the `checkout.session.completed` event in the `/webhook` endpoint
3. Using the Stripe.js library in the frontend to redirect to the Stripe Checkout page

Make sure to replace `'price_1PpvebD4FvYVlZiqB9x3gJsx'` in the `/checkout` endpoint with your actual Stripe Price ID.

## Webhook Setup

To test webhooks locally, you can use a tool like [stripe-cli](https://stripe.com/docs/stripe-cli) to forward events to your local server:

```
stripe listen
```

## Security Considerations

- Always use environment variables to store sensitive information like API keys.
- Ensure that your webhook endpoint verifies the signature of incoming Stripe events.
- Use HTTPS in production to encrypt data in transit.

## License

[MIT License](LICENSE)

## Contact

If you have any questions or feedback, please open an issue in the GitHub repository.
