import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WorkoutPlanViewClient } from "@/components/workout-plan-view-client"

export default async function WorkoutPlanViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/workout-plans/new")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: plan } = await supabase
    .from("workout_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (!plan) {
    redirect("/workout-plans")
  }

  return <WorkoutPlanViewClient plan={plan} />
}
