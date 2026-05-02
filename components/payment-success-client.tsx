"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { User } from "@supabase/supabase-js"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles, ArrowRight, Crown, Zap, Star } from "lucide-react"
import Link from "next/link"

interface PaymentSuccessClientProps {
  user: User
  metadata: any
  planName: string
  tier: string
}

export function PaymentSuccessClient({ user, metadata, planName, tier }: PaymentSuccessClientProps) {
  const confettiTriggered = useRef(false)

  useEffect(() => {
    // Trigger confetti celebration only once
    if (!confettiTriggered.current && typeof window !== "undefined") {
      confettiTriggered.current = true

      // Dynamic import confetti to avoid SSR issues
      import("canvas-confetti").then((confetti) => {
        // First burst
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#a855f7", "#ec4899", "#8b5cf6", "#f472b6"],
        })

        // Second burst
        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#a855f7", "#ec4899", "#8b5cf6"],
          })
        }, 200)

        // Third burst
        setTimeout(() => {
          confetti.default({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#a855f7", "#ec4899", "#8b5cf6"],
          })
        }, 400)
      })
    }
  }, [])

  const getTierIcon = () => {
    switch (tier) {
      case "lifetime":
        return <Crown className="w-16 h-16 text-yellow-500" />
      case "elite":
        return <Star className="w-16 h-16 text-purple-500" />
      case "pro":
        return <Zap className="w-16 h-16 text-blue-500" />
      default:
        return <CheckCircle2 className="w-16 h-16 text-green-500" />
    }
  }

  const getTierGradient = () => {
    switch (tier) {
      case "lifetime":
        return "from-yellow-500/20 via-amber-500/10 to-orange-500/20"
      case "elite":
        return "from-purple-500/20 via-pink-500/10 to-fuchsia-500/20"
      case "pro":
        return "from-blue-500/20 via-cyan-500/10 to-teal-500/20"
      default:
        return "from-green-500/20 via-emerald-500/10 to-teal-500/20"
    }
  }

  const features =
    tier === "lifetime" || tier === "elite"
      ? [
          "Unlimited AI workout plans",
          "Unlimited AI meal plans",
          "24/7 Health Assistant access",
          "Advanced progress analytics",
          "Priority support",
          "PDF exports",
        ]
      : tier === "pro"
        ? [
            "100 AI workout plans/month",
            "100 AI meal plans/month",
            "Health Assistant access",
            "Progress tracking",
            "PDF exports",
          ]
        : []

  return (
    <AppLayout user={user} metadata={metadata}>
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <Card className={`overflow-hidden border-2 bg-gradient-to-br ${getTierGradient()}`}>
            <CardContent className="p-8 md:p-12 text-center space-y-8">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 blur-2xl opacity-50 bg-primary rounded-full" />
                  {getTierIcon()}
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <h1 className="text-3xl md:text-4xl font-bold">Welcome to {planName}!</h1>
                <p className="text-lg text-muted-foreground">
                  Your payment was successful. Your account has been upgraded.
                </p>
              </motion.div>

              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-background/50 backdrop-blur-sm rounded-xl p-6"
              >
                <h3 className="font-semibold mb-4 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your New Benefits
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button asChild size="lg" className="gap-2">
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/workout-plans/new">Generate Your First Plan</Link>
                </Button>
              </motion.div>

              {/* Subscription Info */}
              {tier === "lifetime" && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                >
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Lifetime access - no renewals needed!
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  )
}
