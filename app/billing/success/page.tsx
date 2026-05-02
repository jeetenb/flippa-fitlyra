import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { verifyPaymentAndUpdatePlan } from "@/app/actions/stripe"
import { PaymentSuccessClient } from "@/components/payment-success-client"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const params = await searchParams
  const sessionId = params.session_id

  if (!sessionId) {
    redirect("/billing?error=missing_session")
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Server-side verification of payment
  const result = await verifyPaymentAndUpdatePlan(sessionId)

  if (result.error) {
    redirect(`/billing?error=${encodeURIComponent(result.error)}`)
  }

  // Fetch updated metadata
  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  return (
    <PaymentSuccessClient user={user} metadata={metadata} planName={result.plan || ""} tier={result.tier || "free"} />
  )
}
