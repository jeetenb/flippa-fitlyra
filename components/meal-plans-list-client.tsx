"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChefHat, Download, Eye, Calendar, Target, Plus } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import Link from "next/link"
import { AppLayout } from "@/components/app-layout"

interface MealPlan {
  id: string
  title: string
  goal: string
  diet_preference: string
  calories_per_day: number
  days_count: number
  budget: string
  plan_json: any
  created_at: string
}

interface MealPlansListClientProps {
  plans: MealPlan[]
  user?: any
  metadata?: any
}

export function MealPlansListClient({ plans, user, metadata }: MealPlansListClientProps) {
  const downloadPlan = (plan: MealPlan) => {
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

  return (
    <AppLayout user={user} metadata={metadata} title="Meal Plans">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-6xl mx-auto">
        <div className="text-center mb-8 lg:mb-12">
          <Icon3D
            icon={ChefHat}
            size={48}
            gradientFrom="from-pink-400"
            gradientTo="to-rose-500"
            className="mx-auto mb-4"
          />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
            My Meal Plans
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mb-6">View and manage your AI-generated meal plans</p>
          <Button asChild className="bg-gradient-to-r from-pink-500 to-blue-500">
            <Link href="/meal-plans/new">
              <Plus className="w-4 h-4 mr-2" />
              Generate New Plan
            </Link>
          </Button>
        </div>

        {plans.length === 0 ? (
          <Card className="p-8 sm:p-12 text-center backdrop-blur-xl bg-white/70">
            <p className="text-gray-500 mb-4">No meal plans yet</p>
            <Button asChild>
              <Link href="/meal-plans/new">Create Your First Plan</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="backdrop-blur-xl bg-white/70 border-white/40 shadow-xl p-4 sm:p-6 hover:shadow-2xl transition-shadow">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                    {plan.title}
                  </h3>

                  <div className="space-y-1.5 sm:space-y-2 mb-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>Goal: {plan.goal}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span>{plan.days_count} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{plan.calories_per_day} cal/day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Budget: {plan.budget}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400">
                      Created: {new Date(plan.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/meal-plans/${plan.id}`}>
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadPlan(plan)}>
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
