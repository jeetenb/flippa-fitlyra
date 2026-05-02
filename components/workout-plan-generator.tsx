"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles, Dumbbell } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"

interface WorkoutPlanGeneratorProps {
  userId: string
  user?: any
  metadata?: any
}

export default function WorkoutPlanGenerator({ userId, user, metadata }: WorkoutPlanGeneratorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    goal: "Fat Loss",
    experienceLevel: "Beginner",
    equipment: "No Equipment (Home)",
    trainingSplit: "3 Days/Week",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/ai/workout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId }),
      })

      if (!response.ok) throw new Error("Failed to generate workout plan")

      const data = await response.json()

      if (data.success && data.plan?.id) {
        router.push(`/workout-plans/${data.plan.id}`)
      } else {
        alert("Workout plan generated successfully!")
        router.push("/workout-plans")
      }
    } catch (error) {
      console.error("Error generating workout plan:", error)
      alert("Failed to generate workout plan. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout user={user} metadata={metadata} title="New Workout">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-6 lg:mb-8">
            <Icon3D
              icon={Dumbbell}
              size={48}
              gradientFrom="from-blue-400"
              gradientTo="to-purple-500"
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Generate AI Workout Plan
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">Personalized training programs powered by AI</p>
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
                    <SelectItem value="Fat Loss">Fat Loss</SelectItem>
                    <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                    <SelectItem value="Strength">Strength</SelectItem>
                    <SelectItem value="Endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceLevel" className="text-sm">
                  Experience Level
                </Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
                >
                  <SelectTrigger id="experienceLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment" className="text-sm">
                  Equipment
                </Label>
                <Select
                  value={formData.equipment}
                  onValueChange={(value) => setFormData({ ...formData, equipment: value })}
                >
                  <SelectTrigger id="equipment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No Equipment (Home)">No Equipment (Home)</SelectItem>
                    <SelectItem value="Basic Home Equipment">Basic Home Equipment</SelectItem>
                    <SelectItem value="Full Gym">Full Gym</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainingSplit" className="text-sm">
                  Training Split
                </Label>
                <Select
                  value={formData.trainingSplit}
                  onValueChange={(value) => setFormData({ ...formData, trainingSplit: value })}
                >
                  <SelectTrigger id="trainingSplit">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3 Days/Week">3 Days/Week</SelectItem>
                    <SelectItem value="4 Days/Week">4 Days/Week</SelectItem>
                    <SelectItem value="5 Days/Week">5 Days/Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
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
                    Generate Workout Plan
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
