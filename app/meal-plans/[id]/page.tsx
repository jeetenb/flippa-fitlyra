import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MealPlanViewClient } from "@/components/meal-plan-view-client"

export default async function MealPlanViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (id === "new") {
    redirect("/meal-plans/new")
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: plan } = await supabase.from("meal_plans").select("*").eq("id", id).eq("user_id", user.id).maybeSingle()

  if (!plan) {
    redirect("/meal-plans")
  }

  return <MealPlanViewClient plan={plan} />
}
