import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("[v0] ===== MEAL PLAN API CALLED =====")
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.log("[v0] No user found, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] Request body:", body)
    const { goal, dietPreference, budget, calories, days } = body

    console.log("[v0] Generating meal plan for user:", user.id)
    console.log("[v0] Plan params:", { goal, dietPreference, budget, calories, days })

    // Check usage limits
    const currentMonth = new Date().toISOString().slice(0, 7)
    const { data: usage, error: usageError } = await supabase
      .from("usage_counters")
      .select("*")
      .eq("user_id", user.id)
      .eq("month", currentMonth)
      .maybeSingle()

    if (usageError) {
      console.error("[v0] Usage query error:", usageError)
    }

    const { data: metadata, error: metadataError } = await supabase
      .from("users_metadata")
      .select("subscription_plan")
      .eq("user_id", user.id)
      .maybeSingle()

    if (metadataError) {
      console.error("[v0] Metadata query error:", metadataError)
    }

    const plan = metadata?.subscription_plan || "FREE"
    const limits: Record<string, number> = { FREE: 3, PRO: 100, ELITE: 300, LIFETIME: 300 }

    console.log("[v0] Usage check:", { current: usage?.meal_plans_generated || 0, limit: limits[plan], plan })

    if (usage && usage.meal_plans_generated >= limits[plan]) {
      console.log("[v0] Usage limit reached")
      return NextResponse.json({ error: "Usage limit reached. Please upgrade your plan." }, { status: 429 })
    }

    console.log("[v0] Calling Groq API...")
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are a professional nutritionist. Generate a ${days}-day meal plan in strict JSON format. Do not include markdown code blocks, just return pure JSON:
{
  "days": [
    {
      "day": 1,
      "meals": {
        "breakfast": { "name": "Oatmeal with Berries", "calories": 400, "protein": 20, "carbs": 50, "fat": 10, "description": "Healthy breakfast" },
        "lunch": { "name": "Grilled Chicken Salad", "calories": 500, "protein": 40, "carbs": 30, "fat": 15, "description": "Protein-rich lunch" },
        "dinner": { "name": "Salmon with Vegetables", "calories": 600, "protein": 45, "carbs": 40, "fat": 20, "description": "Balanced dinner" },
        "snacks": { "name": "Greek Yogurt", "calories": 150, "protein": 15, "carbs": 10, "fat": 5, "description": "Protein snack" }
      }
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Create a meal plan with these parameters: Goal: ${goal}, Diet Preference: ${dietPreference}, Budget: ${budget}, Daily Calories: ${calories}. Return ONLY the JSON object, no markdown formatting.`,
          },
        ],
        temperature: 0.7,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error("[v0] Groq API error:", groqResponse.status, errorText)
      throw new Error(`Groq API error: ${groqResponse.status}`)
    }

    const groqData = await groqResponse.json()
    let content = groqData.choices[0].message.content.trim()
    console.log("[v0] Groq response received, content length:", content.length)
    console.log("[v0] First 200 chars:", content.substring(0, 200))

    // Remove markdown code blocks if present
    if (content.startsWith("```")) {
      console.log("[v0] Removing markdown code blocks")
      content = content.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
    }

    let planJson
    try {
      planJson = JSON.parse(content)
      console.log("[v0] Plan JSON parsed successfully, days:", planJson.days?.length)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Content that failed to parse:", content)
      throw new Error("Failed to parse AI response as JSON")
    }

    console.log("[v0] Attempting to save meal plan to database...")
    const insertData = {
      user_id: user.id,
      title: `${goal} - ${dietPreference} Plan`,
      goal,
      diet_preference: dietPreference,
      budget,
      calories_per_day: calories,
      days_count: days,
      plan_json: planJson,
    }
    console.log("[v0] Insert data:", JSON.stringify(insertData, null, 2))

    const { data: mealPlan, error: insertError } = await supabase
      .from("meal_plans")
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Database insert error:", insertError)
      console.error("[v0] Error details:", JSON.stringify(insertError, null, 2))
      throw new Error(`Database error: ${insertError.message}`)
    }

    console.log("[v0] ✅ Meal plan saved successfully with ID:", mealPlan?.id)

    // Update usage counter
    console.log("[v0] Updating usage counter...")
    if (usage) {
      const { error: updateError } = await supabase
        .from("usage_counters")
        .update({ meal_plans_generated: usage.meal_plans_generated + 1, updated_at: new Date().toISOString() })
        .eq("id", usage.id)

      if (updateError) {
        console.error("[v0] Usage update error:", updateError)
      } else {
        console.log("[v0] Usage counter updated")
      }
    } else {
      const { error: insertUsageError } = await supabase.from("usage_counters").insert({
        user_id: user.id,
        month: currentMonth,
        meal_plans_generated: 1,
        workout_plans_generated: 0,
      })

      if (insertUsageError) {
        console.error("[v0] Usage insert error:", insertUsageError)
      } else {
        console.log("[v0] Usage counter created")
      }
    }

    console.log("[v0] ===== MEAL PLAN API SUCCESS =====")
    return NextResponse.json({ success: true, plan: mealPlan })
  } catch (error) {
    console.error("[v0] ===== MEAL PLAN API ERROR =====")
    console.error("[v0] Meal plan generation error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: `Failed to generate meal plan: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
