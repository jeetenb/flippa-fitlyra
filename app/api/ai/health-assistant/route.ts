import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check subscription
    const { data: metadata } = await supabase
      .from("users_metadata")
      .select("subscription_plan")
      .eq("user_id", user.id)
      .maybeSingle()

    const plan = metadata?.subscription_plan || "FREE"
    if (plan === "FREE") {
      return NextResponse.json({ error: "Upgrade to Pro to access the Health Assistant" }, { status: 403 })
    }

    const { message, profile } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Build context from profile
    const profileContext = profile
      ? `User Profile:
- Name: ${profile.full_name || "Not set"}
- Age: ${profile.age || "Not set"}
- Weight: ${profile.weight ? `${profile.weight} kg` : "Not set"}
- Height: ${profile.height ? `${profile.height} cm` : "Not set"}
- Fitness Level: ${profile.fitness_level || "Not set"}
- Fitness Goals: ${profile.fitness_goals?.join(", ") || "Not set"}`
      : "No profile information available."

    const systemPrompt = `You are FitLyra, a friendly and knowledgeable health and fitness assistant. You help users with:
- Nutrition advice and meal suggestions
- Workout recommendations and exercise tips
- General wellness and healthy lifestyle guidance
- Motivation and accountability

${profileContext}

Guidelines:
- Be encouraging and supportive
- Provide practical, actionable advice
- Keep responses concise but helpful (aim for 2-3 paragraphs max)
- If asked about medical conditions, recommend consulting a healthcare professional
- Use emojis sparingly to keep the tone friendly
- Personalize advice based on the user's profile when available`

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text()
      console.error("Groq API error:", errorText)
      return NextResponse.json({ error: "Failed to get AI response" }, { status: 500 })
    }

    const groqData = await groqResponse.json()
    const reply = groqData.choices?.[0]?.message?.content || "I apologize, I could not generate a response."

    // Save messages to chat history
    const conversationId = crypto.randomUUID()

    await supabase.from("ai_chat_history").insert([
      {
        user_id: user.id,
        conversation_id: conversationId,
        role: "user",
        content: message,
      },
      {
        user_id: user.id,
        conversation_id: conversationId,
        role: "assistant",
        content: reply,
      },
    ])

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("Health assistant error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
