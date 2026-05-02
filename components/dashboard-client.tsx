"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowRight, Dumbbell, Utensils, MessageSquare, TrendingUp, Crown, Sparkles } from "lucide-react"
import { AppLayout } from "@/components/app-layout"

interface DashboardClientProps {
  user: any
  profile: any
  metadata: any
  usage: any
  stats: {
    mealPlans: number
    workoutPlans: number
    progressLogs: number
  }
}

export function DashboardClient({ user, profile, metadata, usage, stats }: DashboardClientProps) {
  const subscriptionPlan = metadata?.subscription_plan || "FREE"
  const isLifetime = metadata?.lifetime_access || false

  // Calculate usage limits based on plan
  const limits = {
    FREE: { mealPlans: 3, workoutPlans: 3 },
    PRO: { mealPlans: 100, workoutPlans: 100 },
    ELITE: { mealPlans: 300, workoutPlans: 300 },
    LIFETIME: { mealPlans: 300, workoutPlans: 300 },
  }

  const currentLimits = limits[subscriptionPlan as keyof typeof limits] || limits.FREE
  const mealPlansUsed = usage?.meal_plans_generated || 0
  const workoutPlansUsed = usage?.workout_plans_generated || 0

  const mealPlansPercent = (mealPlansUsed / currentLimits.mealPlans) * 100
  const workoutPlansPercent = (workoutPlansUsed / currentLimits.workoutPlans) * 100

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <AppLayout user={user} metadata={metadata} title="Dashboard">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
            Welcome back, {profile?.full_name || "there"}!
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">Ready to smash your fitness goals today?</p>
        </motion.div>

        {/* Subscription Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="mb-6 lg:mb-8 border-white/20 bg-white/40 backdrop-blur-xl">
            <CardHeader className="pb-3 sm:pb-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                    {isLifetime ? "Lifetime Access" : `${subscriptionPlan} Plan`}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {subscriptionPlan === "FREE"
                      ? "Upgrade to unlock unlimited features"
                      : isLifetime
                        ? "You have lifetime access to all premium features"
                        : "Thank you for being a premium member"}
                  </CardDescription>
                </div>
                {subscriptionPlan === "FREE" && (
                  <Link href="/billing">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-blue-600 text-white hover:opacity-90"
                    >
                      Upgrade <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            {subscriptionPlan !== "LIFETIME" && (
              <CardContent className="pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <div className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm">
                      <span>Meal Plans This Month</span>
                      <span className="font-medium">
                        {mealPlansUsed} / {currentLimits.mealPlans}
                      </span>
                    </div>
                    <Progress value={mealPlansPercent} className="h-1.5 sm:h-2" />
                  </div>
                  <div>
                    <div className="mb-1.5 sm:mb-2 flex items-center justify-between text-xs sm:text-sm">
                      <span>Workout Plans This Month</span>
                      <span className="font-medium">
                        {workoutPlansUsed} / {currentLimits.workoutPlans}
                      </span>
                    </div>
                    <Progress value={workoutPlansPercent} className="h-1.5 sm:h-2" />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-6 lg:mb-8 grid gap-3 sm:gap-4 lg:gap-6 grid-cols-3"
        >
          <motion.div variants={item}>
            <Card className="border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-[10px] sm:text-sm font-medium">Meal Plans</CardTitle>
                <Utensils className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{stats.mealPlans}</div>
                <p className="text-[9px] sm:text-xs text-muted-foreground hidden sm:block">All time</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-[10px] sm:text-sm font-medium">Workouts</CardTitle>
                <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{stats.workoutPlans}</div>
                <p className="text-[9px] sm:text-xs text-muted-foreground hidden sm:block">All time</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="border-white/20 bg-white/40 backdrop-blur-xl transition-all hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 sm:p-6 pb-1 sm:pb-2">
                <CardTitle className="text-[10px] sm:text-sm font-medium">Progress</CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-lg sm:text-2xl font-bold">{stats.progressLogs}</div>
                <p className="text-[9px] sm:text-xs text-muted-foreground hidden sm:block">Entries</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
            <Card className="group cursor-pointer border-white/20 bg-gradient-to-br from-pink-500/10 to-pink-600/10 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg">
              <Link href="/meal-plans/new">
                <CardHeader className="p-3 sm:p-6">
                  <Utensils className="mb-1.5 sm:mb-2 h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />
                  <CardTitle className="text-sm sm:text-lg">Meal Plan</CardTitle>
                  <CardDescription className="text-[10px] sm:text-sm hidden sm:block">
                    Create nutrition plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="flex items-center text-xs sm:text-sm font-medium text-pink-600">
                    Start{" "}
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border-white/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg">
              <Link href="/workout-plans/new">
                <CardHeader className="p-3 sm:p-6">
                  <Dumbbell className="mb-1.5 sm:mb-2 h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                  <CardTitle className="text-sm sm:text-lg">Workout</CardTitle>
                  <CardDescription className="text-[10px] sm:text-sm hidden sm:block">
                    Build training program
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="flex items-center text-xs sm:text-sm font-medium text-blue-600">
                    Start{" "}
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border-white/20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg">
              <Link href="/health-assistant">
                <CardHeader className="p-3 sm:p-6">
                  <MessageSquare className="mb-1.5 sm:mb-2 h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                  <CardTitle className="text-sm sm:text-lg">AI Chat</CardTitle>
                  <CardDescription className="text-[10px] sm:text-sm hidden sm:block">
                    Talk to your coach
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="flex items-center text-xs sm:text-sm font-medium text-purple-600">
                    Open{" "}
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="group cursor-pointer border-white/20 bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-xl transition-all hover:scale-105 hover:shadow-lg">
              <Link href="/progress">
                <CardHeader className="p-3 sm:p-6">
                  <TrendingUp className="mb-1.5 sm:mb-2 h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                  <CardTitle className="text-sm sm:text-lg">Progress</CardTitle>
                  <CardDescription className="text-[10px] sm:text-sm hidden sm:block">
                    Track your journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-6 pt-0">
                  <div className="flex items-center text-xs sm:text-sm font-medium text-green-600">
                    View{" "}
                    <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        </motion.div>

        {/* Daily AI Tip for Premium Users */}
        {(subscriptionPlan === "PRO" || subscriptionPlan === "ELITE" || isLifetime) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 lg:mt-8"
          >
            <Card className="border-white/20 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-xl">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  Daily AI Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm text-gray-700">
                  Stay consistent! Small daily actions compound into massive results over time. Track your progress
                  today to stay motivated for tomorrow.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  )
}
