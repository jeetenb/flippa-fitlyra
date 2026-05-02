import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BillingClient } from "@/components/billing-client"

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  return <BillingClient user={user} metadata={metadata} />
}
