const Stripe = require('stripe');
const config = require('./env');

/**
 * Initialize Stripe instance
 * The apiVersion ensures your code doesn't break when Stripe updates their SDK.
 */
const stripe = new Stripe(config.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use the latest stable version
  appInfo: {
    name: 'Airbnb-Clone-Backend',
    version: '1.0.0',
  },
});

module.exports = stripe;