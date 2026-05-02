import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProgressTrackerClient } from "@/components/progress-tracker-client"

export default async function ProgressPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: progressLogs } = await supabase
    .from("progress_tracking")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(30)

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  const { count: workoutsThisWeek } = await supabase
    .from("workout_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true)
    .gte("completed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const currentMonth = new Date().toISOString().slice(0, 7)
  const { count: mealPlansThisMonth } = await supabase
    .from("meal_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${currentMonth}-01`)

  const { count: workoutPlansThisMonth } = await supabase
    .from("workout_plans")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${currentMonth}-01`)

  return (
    <ProgressTrackerClient
      user={user}
      profile={profile}
      progressLogs={progressLogs || []}
      stats={{
        workoutsThisWeek: workoutsThisWeek || 0,
        mealPlansThisMonth: mealPlansThisMonth || 0,
        workoutPlansThisMonth: workoutPlansThisMonth || 0,
      }}
      metadata={metadata}
    />
  )
}
