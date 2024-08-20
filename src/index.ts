import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import 'dotenv/config';

import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const app = new Hono();

app.post('/', (c) => {
  return c.text('Hi Hono!');
});

app.post('/checkout', async (c) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1PpvebD4FvYVlZiqB9x3gJsx',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return c.json(session);
  } catch (error: any) {
    console.error(error);
    throw new HTTPException(500, { message: error?.message });
  }
});

app.post('/webhook', async (c) => {
  const rawBody = await c.req.text();
  const signature = c.req.header('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`);
    throw new HTTPException(400);
  }

  // Handle checkout.session.completed event.
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log(session);
  }

  return c.text('success');
});

app.get('/success', (c) => {
  return c.text('Thanks for your purchase!');
});

app.get('/cancel', (c) => {
  return c.text('Your purchase has been canceled!');
});

app.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://js.stripe.com/v3/"></script>
    <title>Checkout</title>
  </head>
  <body>
    <h1>Checkout</h1>
    <button id="checkoutButton">Checkout</button>

    <script>
      const checkoutButton = document.getElementById('checkoutButton');
      checkoutButton.addEventListener('click', async () => {
        const response = await fetch('/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const { id } = await response.json();
        const stripe = Stripe('${process.env.STRIPE_PUBLISHABLE_KEY}');
        await stripe.redirectToCheckout({ sessionId: id });
      });
    </script>
  </body>
</html>
`;
  return c.html(html);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
