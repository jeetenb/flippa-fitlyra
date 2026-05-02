"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dumbbell, Download, ArrowLeft } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface WorkoutPlanViewClientProps {
  plan: any
}

export function WorkoutPlanViewClient({ plan }: WorkoutPlanViewClientProps) {
  const downloadPlan = () => {
    const content = `
FitLyra - Workout Plan
===========================

Title: ${plan.title}
Goal: ${plan.goal}
Level: ${plan.experience_level}
Equipment: ${plan.equipment}
Split: ${plan.training_split}
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-6 bg-transparent">
          <Link href="/workout-plans">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Link>
        </Button>

        <div className="text-center mb-8">
          <Icon3D
            icon={Dumbbell}
            size={64}
            gradientFrom="from-blue-400"
            gradientTo="to-purple-500"
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {plan.title}
          </h1>
          <div className="flex justify-center gap-2 mb-4">
            <Badge variant="secondary">{plan.goal}</Badge>
            <Badge variant="secondary">{plan.experience_level}</Badge>
            <Badge variant="secondary">{plan.training_split}</Badge>
          </div>
          <Button onClick={downloadPlan} className="bg-gradient-to-r from-blue-500 to-purple-500">
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
                <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Day {day.day} - {day.focus}
                </h2>

                <div className="space-y-4">
                  {day.exercises?.map((exercise: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-400 pl-4">
                      <h3 className="font-semibold text-lg mb-1">{exercise.name}</h3>
                      <div className="flex gap-4 text-sm text-gray-600 mb-2">
                        <span>Sets: {exercise.sets}</span>
                        <span>Reps: {exercise.reps}</span>
                        {exercise.rest && <span>Rest: {exercise.rest}</span>}
                      </div>
                      {exercise.notes && <p className="text-sm text-gray-500 italic">{exercise.notes}</p>}
                    </div>
                  ))}
                </div>

                {day.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {day.notes}
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
