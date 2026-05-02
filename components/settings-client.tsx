"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Lock, Trash2, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"
import { AppLayout } from "@/components/app-layout"

interface SettingsClientProps {
  user: SupabaseUser
  profile: {
    full_name?: string
    age?: number
    height?: number
    weight?: number
    fitness_level?: string
    fitness_goals?: string[]
  } | null
  metadata?: any
}

const fitnessLevels = ["Beginner", "Intermediate", "Advanced"]
const fitnessGoals = ["Weight Loss", "Muscle Gain", "Maintenance", "Endurance", "Strength", "Flexibility"]

export function SettingsClient({ user, profile, metadata }: SettingsClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    age: profile?.age?.toString() || "",
    height: profile?.height?.toString() || "",
    weight: profile?.weight?.toString() || "",
    fitnessLevel: profile?.fitness_level || "",
    fitnessGoals: profile?.fitness_goals || [],
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.fullName,
        age: formData.age ? Number.parseInt(formData.age) : null,
        height: formData.height ? Number.parseFloat(formData.height) : null,
        weight: formData.weight ? Number.parseFloat(formData.weight) : null,
        fitness_level: formData.fitnessLevel || null,
        fitness_goals: formData.fitnessGoals.length > 0 ? formData.fitnessGoals : null,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error saving profile:", error)
      alert("Failed to save profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return
    if (!confirm("This will permanently delete all your data. Are you absolutely sure?")) return

    setIsLoading(true)
    try {
      await supabase.from("meal_plans").delete().eq("user_id", user.id)
      await supabase.from("workout_plans").delete().eq("user_id", user.id)
      await supabase.from("progress_tracking").delete().eq("user_id", user.id)
      await supabase.from("ai_chat_history").delete().eq("user_id", user.id)
      await supabase.from("profiles").delete().eq("id", user.id)

      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("Failed to delete account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      fitnessGoals: prev.fitnessGoals.includes(goal)
        ? prev.fitnessGoals.filter((g) => g !== goal)
        : [...prev.fitnessGoals, goal],
    }))
  }

  return (
    <AppLayout user={user} metadata={metadata} title="Settings">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your account and preferences</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Profile Settings */}
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-sm">
                Update your personal details for better AI recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-sm">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="25"
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height" className="text-sm">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="175"
                    className="bg-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight" className="text-sm">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70"
                    className="bg-white/80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Fitness Level</Label>
                <Select
                  value={formData.fitnessLevel}
                  onValueChange={(v) => setFormData({ ...formData, fitnessLevel: v })}
                >
                  <SelectTrigger className="bg-white/80">
                    <SelectValue placeholder="Select your fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    {fitnessLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Fitness Goals</Label>
                <div className="flex flex-wrap gap-2">
                  {fitnessGoals.map((goal) => (
                    <Button
                      key={goal}
                      type="button"
                      variant={formData.fitnessGoals.includes(goal) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleGoal(goal)}
                      className={formData.fitnessGoals.includes(goal) ? "bg-pink-500 hover:bg-pink-600" : ""}
                    >
                      {goal}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-gradient-to-r from-pink-500 to-blue-600 hover:opacity-90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-pink-500" />
                Account
              </CardTitle>
              <CardDescription className="text-sm">Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Email Address</Label>
                <Input value={user.email || ""} disabled className="bg-gray-100/50" />
                <p className="text-xs text-gray-400">Contact support to change your email</p>
              </div>

              <Button variant="outline" asChild>
                <Link href="/billing">Manage Subscription</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-white/60 backdrop-blur-xl border-red-200/50 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-red-500">
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-sm">Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Once you delete your account, there is no going back. All your data will be permanently removed.
              </p>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
