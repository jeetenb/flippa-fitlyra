import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as any
        const userId = session.metadata?.user_id
        const planId = session.metadata?.plan_id

        if (!userId || !planId) {
          console.error("Missing metadata in checkout session")
          break
        }

        const isLifetime = planId === "LIFETIME"

        await supabaseAdmin.from("users_metadata").upsert({
          user_id: userId,
          subscription_plan: planId,
          lifetime_access: isLifetime,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription || null,
          updated_at: new Date().toISOString(),
        })

        console.log(`User ${userId} upgraded to ${planId}`)
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        // Find user by customer ID
        const { data: metadata } = await supabaseAdmin
          .from("users_metadata")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .single()

        if (metadata?.user_id) {
          const status = subscription.status

          if (status === "active") {
            // Subscription is active
            await supabaseAdmin
              .from("users_metadata")
              .update({
                stripe_subscription_id: subscription.id,
                updated_at: new Date().toISOString(),
              })
              .eq("user_id", metadata.user_id)
          }
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        // Find user by customer ID
        const { data: metadata } = await supabaseAdmin
          .from("users_metadata")
          .select("user_id, lifetime_access")
          .eq("stripe_customer_id", customerId)
          .single()

        if (metadata?.user_id && !metadata.lifetime_access) {
          // Downgrade to free if not lifetime
          await supabaseAdmin
            .from("users_metadata")
            .update({
              subscription_plan: "FREE",
              stripe_subscription_id: null,
              updated_at: new Date().toISOString(),
            })
            .eq("user_id", metadata.user_id)

          console.log(`User ${metadata.user_id} downgraded to FREE`)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
