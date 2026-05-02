import { DashboardClient } from "@/components/dashboard-client"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  // Fetch usage counters for current month
  const currentMonth = new Date().toISOString().slice(0, 7) // '2025-01'
  const { data: usage } = await supabase
    .from("usage_counters")
    .select("*")
    .eq("user_id", user.id)
    .eq("month", currentMonth)
    .maybeSingle()

  // Fetch counts
  const { count: mealPlansCount } = await supabase
    .from("meal_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: workoutPlansCount } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { count: progressLogsCount } = await supabase
    .from("progress_logs")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  return (
    <DashboardClient
      user={user}
      profile={profile}
      metadata={metadata}
      usage={usage}
      stats={{
        mealPlans: mealPlansCount || 0,
        workoutPlans: workoutPlansCount || 0,
        progressLogs: progressLogsCount || 0,
      }}
    />
  )
}
