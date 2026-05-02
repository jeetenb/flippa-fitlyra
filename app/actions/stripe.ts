"use server"

import { stripe } from "@/lib/stripe"
import { PRODUCTS } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export async function createCheckoutSession(planId: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to upgrade your plan" }
    }

    const product = PRODUCTS.find((p) => p.id === planId)
    if (!product) {
      return { error: `Plan "${planId}" not found` }
    }

    // Get or create Stripe customer
    const { data: metadata } = await supabase
      .from("users_metadata")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle()

    let customerId = metadata?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: user.id,
        },
      })
      customerId = customer.id

      // Save customer ID
      await supabase.from("users_metadata").upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
    }

    const headersList = await headers()
    const origin = headersList.get("origin") || "http://localhost:3000"

    // Create checkout session based on plan type
    const isOneTime = product.interval === null

    const sessionConfig: any = {
      customer: customerId,
      success_url: `${origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/billing?canceled=true`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
            ...(isOneTime
              ? {}
              : {
                  recurring: {
                    interval: product.interval,
                    interval_count: product.intervalCount || 1,
                  },
                }),
          },
          quantity: 1,
        },
      ],
      mode: isOneTime ? "payment" : "subscription",
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return { url: session.url }
  } catch (error) {
    console.error("Checkout session error:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function verifyPaymentAndUpdatePlan(sessionId: string) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Not authenticated" }
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "payment_intent"],
    })

    // Verify the session belongs to this user
    if (session.metadata?.user_id !== user.id) {
      return { error: "Session does not belong to this user" }
    }

    // Check payment status
    if (session.payment_status !== "paid") {
      return { error: "Payment not completed" }
    }

    const planId = session.metadata?.plan_id
    const product = PRODUCTS.find((p) => p.id === planId)

    if (!product) {
      return { error: "Invalid plan" }
    }

    // Determine subscription plan based on planId
    let subscriptionPlan = "FREE"
    let lifetimeAccess = false

    if (planId === "PRO") {
      subscriptionPlan = "PRO"
    } else if (planId === "ELITE") {
      subscriptionPlan = "ELITE"
    } else if (planId === "LIFETIME") {
      subscriptionPlan = "LIFETIME"
      lifetimeAccess = true
    }

    // Get Stripe subscription ID if it's a subscription
    let stripeSubscriptionId: string | null = null
    if (session.subscription) {
      stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription.id
    }

    // Update the user's metadata in the database with correct field names
    const { error: updateError } = await supabase.from("users_metadata").upsert({
      user_id: user.id,
      subscription_plan: subscriptionPlan,
      lifetime_access: lifetimeAccess,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: session.customer as string,
      updated_at: new Date().toISOString(),
    })

    if (updateError) {
      console.error("Database update error:", updateError)
      return { error: "Failed to update subscription" }
    }

    // Also update the profiles table for consistency
    await supabase.from("profiles").upsert({
      id: user.id,
      subscription_tier: subscriptionPlan.toLowerCase(),
      subscription_status: "active",
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: session.customer as string,
      updated_at: new Date().toISOString(),
    })

    // Reset usage counters for the new billing period
    const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM format
    await supabase.from("usage_counters").upsert({
      user_id: user.id,
      month: currentMonth,
      meal_plans_generated: 0,
      workout_plans_generated: 0,
    })

    return {
      success: true,
      plan: product.name,
      tier: subscriptionPlan.toLowerCase(),
    }
  } catch (error) {
    console.error("Payment verification error:", error)
    return { error: "Failed to verify payment" }
  }
}

export async function createPortalSession() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Please sign in to manage your subscription" }
    }

    const { data: metadata } = await supabase
      .from("users_metadata")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!metadata?.stripe_customer_id) {
      return { error: "No billing account found. Please upgrade first." }
    }

    const headersList = await headers()
    const origin = headersList.get("origin") || "http://localhost:3000"

    const session = await stripe.billingPortal.sessions.create({
      customer: metadata.stripe_customer_id,
      return_url: `${origin}/billing`,
    })

    return { url: session.url }
  } catch (error) {
    console.error("Portal session error:", error)
    return { error: "Failed to open billing portal" }
  }
}

// Keep existing function for backwards compatibility
export async function startCheckoutSession(productId: string) {
  const result = await createCheckoutSession(productId)
  if (result.error) {
    throw new Error(result.error)
  }
  return result.url
}
