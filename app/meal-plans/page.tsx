import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MealPlansListClient } from "@/components/meal-plans-list-client"

export default async function MealPlansPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: metadata } = await supabase.from("users_metadata").select("*").eq("user_id", user.id).maybeSingle()

  const { data: plans } = await supabase
    .from("meal_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <MealPlansListClient plans={plans || []} user={user} metadata={metadata} />
}
