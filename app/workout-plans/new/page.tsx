import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import WorkoutPlanGenerator from "@/components/workout-plan-generator"

export default async function NewWorkoutPlanPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  return <WorkoutPlanGenerator userId={user.id} user={user} metadata={metadata} />
}
