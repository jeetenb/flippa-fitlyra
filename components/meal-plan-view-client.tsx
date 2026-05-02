"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, Download, ArrowLeft } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface MealPlanViewClientProps {
  plan: any
}

export function MealPlanViewClient({ plan }: MealPlanViewClientProps) {
  const downloadPlan = () => {
    const content = `
FitLyra - Meal Plan
========================

Title: ${plan.title}
Goal: ${plan.goal}
Diet: ${plan.diet_preference}
Daily Calories: ${plan.calories_per_day}
Duration: ${plan.days_count} days
Budget: ${plan.budget}
Created: ${new Date(plan.created_at).toLocaleDateString()}

${JSON.stringify(plan.plan_json, null, 2)}
    `

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${plan.title.replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const planData = plan.plan_json

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-6 bg-transparent">
          <Link href="/meal-plans">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Link>
        </Button>

        <div className="text-center mb-8">
          <Icon3D
            icon={ChefHat}
            size={64}
            gradientFrom="from-pink-400"
            gradientTo="to-rose-500"
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {plan.title}
          </h1>
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary">{plan.goal}</Badge>
            <Badge variant="secondary">{plan.diet_preference}</Badge>
            <Badge variant="secondary">{plan.calories_per_day} cal/day</Badge>
          </div>
          <Button onClick={downloadPlan} className="bg-gradient-to-r from-pink-500 to-blue-500">
            <Download className="h-4 w-4 mr-2" />
            Download Plan
          </Button>
        </div>

        <div className="space-y-6">
          {planData?.days?.map((day: any, index: number) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="backdrop-blur-xl bg-white/70 border-white/40 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Day {day.day}
                </h2>

                <div className="space-y-4">
                  {Object.entries(day.meals).map(([mealType, meal]: [string, any]) => (
                    <div key={mealType} className="border-l-4 border-pink-400 pl-4">
                      <h3 className="font-semibold text-lg capitalize mb-2">{mealType}</h3>
                      <p className="font-medium text-gray-800 mb-1">{meal.name}</p>
                      {meal.description && <p className="text-sm text-gray-600 mb-2">{meal.description}</p>}
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>🔥 {meal.calories} cal</span>
                        <span>💪 {meal.protein}g protein</span>
                        <span>🍞 {meal.carbs}g carbs</span>
                        <span>🥑 {meal.fat}g fat</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-semibold text-gray-700">
                    Daily Total: {day.total_calories} calories | Protein: {day.total_protein}g | Carbs:{" "}
                    {day.total_carbs}g | Fat: {day.total_fat}g
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
