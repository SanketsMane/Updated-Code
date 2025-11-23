import "server-only";

import Stripe from "stripe";
import { env } from "./env";

// Initialize Stripe with fallback for build time
const stripeKey = process.env.SKIP_ENV_VALIDATION 
  ? "sk_test_dummy_key_for_build" 
  : env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-05-28.basil",
  typescript: true,
});
