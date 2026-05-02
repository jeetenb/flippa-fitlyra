import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HealthAssistantClient } from "@/components/health-assistant-client"

export default async function HealthAssistantPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  const { data: chatHistory } = await supabase
    .from("ai_chat_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(50)

  const subscriptionPlan = metadata?.subscription_plan || "FREE"
  const hasAccess = subscriptionPlan !== "FREE"

  return (
    <HealthAssistantClient
      user={user}
      profile={profile}
      chatHistory={chatHistory || []}
      hasAccess={hasAccess}
      subscriptionPlan={subscriptionPlan}
      metadata={metadata}
    />
  )
}
