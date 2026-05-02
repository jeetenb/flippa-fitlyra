"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, ChefHat } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"

interface MealPlanGeneratorProps {
  userId: string
  user?: any
  metadata?: any
}

export default function MealPlanGenerator({ userId, user, metadata }: MealPlanGeneratorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    goal: "Weight Loss",
    dietPreference: "None",
    budget: "Balanced",
    calories: 2000,
    days: 7,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/ai/meal-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })

      if (!response.ok) throw new Error("Failed to generate meal plan")

      const data = await response.json()

      if (data.success && data.plan?.id) {
        router.push(`/meal-plans/${data.plan.id}`)
      } else {
        alert("Meal plan generated successfully!")
        router.push("/meal-plans")
      }
    } catch (error) {
      console.error("Error generating meal plan:", error)
      alert("Failed to generate meal plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout user={user} metadata={metadata} title="New Meal Plan">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-6 lg:mb-8">
            <Icon3D
              icon={ChefHat}
              size={48}
              gradientFrom="from-pink-400"
              gradientTo="to-rose-500"
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Generate AI Meal Plan
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Personalized nutrition plans powered by AI</p>
          </div>

          <Card className="backdrop-blur-xl bg-white/70 border-white/40 shadow-xl p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goal" className="text-sm">
                  Goal
                </Label>
                <Select value={formData.goal} onValueChange={(value) => setFormData({ ...formData, goal: value })}>
                  <SelectTrigger id="goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dietPreference" className="text-sm">
                  Diet Preference
                </Label>
                <Select
                  value={formData.dietPreference}
                  onValueChange={(value) => setFormData({ ...formData, dietPreference: value })}
                >
                  <SelectTrigger id="dietPreference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None</SelectItem>
                    <SelectItem value="Keto">Keto</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Vegan">Vegan</SelectItem>
                    <SelectItem value="Low Carb">Low Carb</SelectItem>
                    <SelectItem value="High Protein">High Protein</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-sm">
                  Budget
                </Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger id="budget">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Budget Friendly">Budget Friendly</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="calories" className="text-sm">
                    Daily Calories
                  </Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: Number.parseInt(e.target.value) })}
                    min={1200}
                    max={4000}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="days" className="text-sm">
                    Number of Days
                  </Label>
                  <Input
                    id="days"
                    type="number"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: Number.parseInt(e.target.value) })}
                    min={1}
                    max={30}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Your Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Meal Plan
                  </>
                )}
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
