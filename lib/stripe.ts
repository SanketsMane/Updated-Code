import "server-only";

import Stripe from "stripe";
import { env } from "./env";

// Initialize Stripe with fallback for build time
const stripeKey = process.env.SKIP_ENV_VALIDATION || !env.STRIPE_SECRET_KEY
  ? "sk_test_dummy_key_for_build_bypass"
  : env.STRIPE_SECRET_KEY;

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});
