import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("[v0] ===== WORKOUT PLAN API CALLED =====")
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
    const { goal, experienceLevel, equipment, trainingSplit } = body

    console.log("[v0] Generating workout plan for user:", user.id)
    console.log("[v0] Plan params:", { goal, experienceLevel, equipment, trainingSplit })

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

    console.log("[v0] Usage check:", { current: usage?.workout_plans_generated || 0, limit: limits[plan], plan })

    if (usage && usage.workout_plans_generated >= limits[plan]) {
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
            content: `You are a professional fitness trainer. Generate a workout plan in strict JSON format. Do not include markdown code blocks, just return pure JSON:
{
  "days": [
    {
      "day": 1,
      "name": "Upper Body",
      "exercises": [
        { "name": "Push-ups", "sets": 3, "reps": 12, "rest_seconds": 60, "notes": "Keep core tight" }
      ]
    }
  ]
}`,
          },
          {
            role: "user",
            content: `Create a workout plan with these parameters: Goal: ${goal}, Experience Level: ${experienceLevel}, Available Equipment: ${equipment}, Training Split: ${trainingSplit}. Return ONLY the JSON object, no markdown formatting.`,
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

    console.log("[v0] Attempting to save workout plan to database...")
    const insertData = {
      user_id: user.id,
      title: `${goal} - ${experienceLevel} Program`,
      description: `AI-generated ${trainingSplit} workout plan for ${goal.toLowerCase()}`,
      goal,
      experience_level: experienceLevel,
      equipment,
      training_split: trainingSplit,
      plan_json: planJson,
      ai_generated: true,
      is_active: true,
    }
    console.log("[v0] Insert data:", JSON.stringify(insertData, null, 2))

    const { data: workoutPlan, error: insertError } = await supabase
      .from("workout_plans")
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Database insert error:", insertError)
      console.error("[v0] Error details:", JSON.stringify(insertError, null, 2))
      throw new Error(`Database error: ${insertError.message}`)
    }

    console.log("[v0] ✅ Workout plan saved successfully with ID:", workoutPlan?.id)

    // Update usage counter
    console.log("[v0] Updating usage counter...")
    if (usage) {
      const { error: updateError } = await supabase
        .from("usage_counters")
        .update({ workout_plans_generated: usage.workout_plans_generated + 1, updated_at: new Date().toISOString() })
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
        meal_plans_generated: 0,
        workout_plans_generated: 1,
      })

      if (insertUsageError) {
        console.error("[v0] Usage insert error:", insertUsageError)
      } else {
        console.log("[v0] Usage counter created")
      }
    }

    console.log("[v0] ===== WORKOUT PLAN API SUCCESS =====")
    return NextResponse.json({ success: true, plan: workoutPlan })
  } catch (error) {
    console.error("[v0] ===== WORKOUT PLAN API ERROR =====")
    console.error("[v0] Workout plan generation error:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      { error: `Failed to generate workout plan: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
