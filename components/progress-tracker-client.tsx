"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, TrendingUp, TrendingDown, Scale, Zap, Calendar, Target, Dumbbell, Apple, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { createBrowserClient } from "@supabase/ssr"
import { AppLayout } from "@/components/app-layout"

interface ProgressLog {
  id: string
  date: string
  weight?: number
  body_fat_percentage?: number
  mood?: string
  energy_level?: number
  sleep_hours?: number
  notes?: string
  created_at: string
}

interface ProgressTrackerClientProps {
  user: SupabaseUser
  profile: {
    full_name?: string
    weight?: number
  } | null
  progressLogs: ProgressLog[]
  stats: {
    workoutsThisWeek: number
    mealPlansThisMonth: number
    workoutPlansThisMonth: number
  }
  metadata?: any
}

const moodOptions = [
  { value: "great", label: "Great", emoji: "😄" },
  { value: "good", label: "Good", emoji: "🙂" },
  { value: "okay", label: "Okay", emoji: "😐" },
  { value: "tired", label: "Tired", emoji: "😴" },
  { value: "stressed", label: "Stressed", emoji: "😰" },
]

export function ProgressTrackerClient({ user, profile, progressLogs, stats, metadata }: ProgressTrackerClientProps) {
  const [logs, setLogs] = useState<ProgressLog[]>(progressLogs)
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    weight: "",
    bodyFat: "",
    mood: "",
    energy: "",
    sleep: "",
    notes: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  // Prepare chart data
  const chartData = [...logs]
    .reverse()
    .slice(-14)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight: log.weight,
      energy: log.energy_level,
      sleep: log.sleep_hours,
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Saving progress log for user:", user.id)
      const logData = {
        user_id: user.id,
        date: new Date().toISOString().split("T")[0],
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        body_fat_percentage: formData.bodyFat ? Number.parseFloat(formData.bodyFat) : null,
        mood: formData.mood || null,
        energy_level: formData.energy ? Number.parseInt(formData.energy) : null,
        sleep_hours: formData.sleep ? Number.parseFloat(formData.sleep) : null,
        notes: formData.notes || null,
      }
      console.log("[v0] Progress log data:", logData)

      const { data, error } = await supabase
        .from("progress_tracking")
        .insert(logData)
        .select()
        .single()

      if (error) {
        console.error("[v0] Supabase error:", error)
        throw error
      }

      console.log("[v0] Progress log saved successfully:", data)
      setLogs([data, ...logs])
      setFormData({ weight: "", bodyFat: "", mood: "", energy: "", sleep: "", notes: "" })
      setShowForm(false)
      alert("Progress logged successfully!")
    } catch (error: any) {
      console.error("[v0] Error saving progress:", error)
      alert(`Failed to save progress log: ${error.message || "Please try again."}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this log?")) return

    try {
      const { error } = await supabase.from("progress_tracking").delete().eq("id", id)

      if (error) throw error

      setLogs(logs.filter((log) => log.id !== id))
    } catch (error) {
      console.error("Error deleting log:", error)
      alert("Failed to delete log. Please try again.")
    }
  }

  // Calculate trends
  const latestWeight = logs[0]?.weight
  const previousWeight = logs[1]?.weight
  const weightTrend = latestWeight && previousWeight ? latestWeight - previousWeight : 0

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <AppLayout user={user} metadata={metadata} title="Progress">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
              Progress Tracker
            </h1>
            <p className="text-gray-500 text-sm sm:text-base">Track your fitness journey</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-pink-500 to-blue-600 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Progress
          </Button>
        </div>

        {/* Add Progress Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 lg:mb-8"
          >
            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl">Log Today's Progress</CardTitle>
                <CardDescription className="text-sm">Track your metrics to see improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="weight" className="text-sm">
                        Weight (kg)
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        placeholder="75.5"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        className="bg-white/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bodyFat" className="text-sm">
                        Body Fat %
                      </Label>
                      <Input
                        id="bodyFat"
                        type="number"
                        step="0.1"
                        placeholder="20.0"
                        value={formData.bodyFat}
                        onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
                        className="bg-white/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sleep" className="text-sm">
                        Sleep Hours
                      </Label>
                      <Input
                        id="sleep"
                        type="number"
                        step="0.5"
                        placeholder="7.5"
                        value={formData.sleep}
                        onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
                        className="bg-white/80"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mood" className="text-sm">
                        Mood
                      </Label>
                      <Select value={formData.mood} onValueChange={(v) => setFormData({ ...formData, mood: v })}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="How are you feeling?" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.emoji} {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="energy" className="text-sm">
                        Energy Level (1-10)
                      </Label>
                      <Select value={formData.energy} onValueChange={(v) => setFormData({ ...formData, energy: v })}>
                        <SelectTrigger className="bg-white/80">
                          <SelectValue placeholder="Rate your energy" />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="How did your day go?"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="bg-white/80"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-pink-500 to-blue-600 hover:opacity-90"
                    >
                      {isSubmitting ? "Saving..." : "Save Progress"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 lg:space-y-8">
          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-lg">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Weight</p>
                    <p className="text-base sm:text-xl font-bold">{latestWeight ? `${latestWeight}kg` : "—"}</p>
                    {weightTrend !== 0 && (
                      <div
                        className={`flex items-center gap-1 text-[10px] sm:text-xs ${weightTrend < 0 ? "text-green-600" : "text-orange-600"}`}
                      >
                        {weightTrend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        {Math.abs(weightTrend).toFixed(1)}kg
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-lg">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center">
                    <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Workouts</p>
                    <p className="text-base sm:text-xl font-bold">{stats.workoutsThisWeek}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-lg">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                    <Apple className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Meal Plans</p>
                    <p className="text-base sm:text-xl font-bold">{stats.mealPlansThisMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-lg">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-500">Workout Plans</p>
                    <p className="text-base sm:text-xl font-bold">{stats.workoutPlansThisMonth}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div variants={itemVariants}>
              <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                    Weight Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.filter((d) => d.weight).length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" fontSize={10} stroke="#9ca3af" />
                        <YAxis fontSize={10} stroke="#9ca3af" domain={["dataMin - 2", "dataMax + 2"]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="weight"
                          stroke="#ec4899"
                          strokeWidth={2}
                          fill="url(#weightGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                      <p>Log your weight to see progress</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    Energy & Sleep
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.filter((d) => d.energy || d.sleep).length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" fontSize={10} stroke="#9ca3af" />
                        <YAxis fontSize={10} stroke="#9ca3af" domain={[0, 10]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="energy"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ fill: "#f59e0b", r: 3 }}
                          name="Energy"
                        />
                        <Line
                          type="monotone"
                          dataKey="sleep"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ fill: "#8b5cf6", r: 3 }}
                          name="Sleep"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">
                      <p>Log energy and sleep to see trends</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Logs */}
          <motion.div variants={itemVariants}>
            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                  Recent Progress Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logs.length > 0 ? (
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-white/50 border border-white/40"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm sm:text-base">
                            {new Date(log.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-500">
                            {log.weight && <span>{log.weight}kg</span>}
                            {log.energy_level && <span>Energy: {log.energy_level}/10</span>}
                            {log.sleep_hours && <span>Sleep: {log.sleep_hours}h</span>}
                            {log.mood && <span>{moodOptions.find((m) => m.value === log.mood)?.emoji}</span>}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(log.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="mb-4 text-sm">No progress logs yet</p>
                    <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
                      Log Your First Entry
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </AppLayout>
  )
}
