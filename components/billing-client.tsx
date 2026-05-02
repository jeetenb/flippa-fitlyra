"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Crown, Check, Zap, Loader2, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { createCheckoutSession, createPortalSession } from "@/app/actions/stripe"
import { AppLayout } from "@/components/app-layout"

interface BillingClientProps {
  user: SupabaseUser
  metadata: {
    subscription_plan?: string
    lifetime_access?: boolean
    stripe_customer_id?: string
    stripe_subscription_id?: string
  } | null
}

const plans = [
  {
    id: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic features",
    features: ["3 meal plans/month", "3 workout plans/month", "Basic progress tracking"],
    limitations: ["No AI assistant", "Limited exports"],
  },
  {
    id: "PRO",
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For dedicated fitness enthusiasts",
    features: ["100 plans/month", "AI health assistant", "PDF exports", "Unlimited progress logs"],
    popular: true,
  },
  {
    id: "ELITE",
    name: "Elite",
    price: "$29.99",
    period: "/month",
    description: "Maximum value for athletes",
    features: ["300 plans/month", "Everything in Pro", "Daily AI tips", "Advanced analytics"],
  },
  {
    id: "LIFETIME",
    name: "Lifetime",
    price: "$109",
    period: "one-time",
    description: "Pay once, use forever",
    features: ["Everything in Elite", "Never pay again", "Early access features", "Lifetime support"],
    bestValue: true,
  },
]

export function BillingClient({ user, metadata }: BillingClientProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [isManaging, setIsManaging] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const searchParams = useSearchParams()

  const currentPlan = metadata?.subscription_plan || "FREE"
  const isLifetime = metadata?.lifetime_access || false

  useEffect(() => {
    const canceled = searchParams.get("canceled")
    const error = searchParams.get("error")

    if (canceled === "true") {
      setMessage({ type: "error", text: "Payment was canceled. You can try again anytime." })
    } else if (error) {
      setMessage({ type: "error", text: decodeURIComponent(error) })
    }

    // Clear message after 5 seconds
    if (canceled || error) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleUpgrade = async (planId: string) => {
    setLoadingPlan(planId)
    setMessage(null)
    try {
      const result = await createCheckoutSession(planId)
      if (result.url) {
        window.location.href = result.url
      } else if (result.error) {
        setMessage({ type: "error", text: result.error })
      }
    } catch (error) {
      console.error("Checkout error:", error)
      setMessage({ type: "error", text: "Failed to start checkout. Please try again." })
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleManageBilling = async () => {
    setIsManaging(true)
    setMessage(null)
    try {
      const result = await createPortalSession()
      if (result.url) {
        window.location.href = result.url
      } else if (result.error) {
        setMessage({ type: "error", text: result.error })
      }
    } catch (error) {
      console.error("Portal error:", error)
      setMessage({ type: "error", text: "Failed to open billing portal. Please try again." })
    } finally {
      setIsManaging(false)
    }
  }

  return (
    <AppLayout user={user} metadata={metadata} title="Billing">
      <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            Billing & Subscription
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">Manage your subscription plan</p>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
              className={message.type === "success" ? "border-green-500 bg-green-500/10" : ""}
            >
              {message.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Current Plan Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 lg:mb-8">
          <Card className="bg-gradient-to-br from-pink-500/10 to-blue-600/10 backdrop-blur-xl border-pink-500/20 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    Current Plan: {isLifetime ? "Lifetime" : currentPlan}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {isLifetime
                      ? "You have lifetime access to all premium features"
                      : currentPlan === "FREE"
                        ? "Upgrade to unlock more features"
                        : "Thank you for being a premium member"}
                  </CardDescription>
                </div>
                {metadata?.stripe_subscription_id && !isLifetime && (
                  <Button variant="outline" onClick={handleManageBilling} disabled={isManaging} size="sm">
                    {isManaging ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Manage Billing
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {plans.map((plan, index) => {
            const isCurrentPlan = plan.id === currentPlan || (plan.id === "LIFETIME" && isLifetime)
            const canUpgrade = !isLifetime && plan.id !== "FREE" && plan.id !== currentPlan

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/20 shadow-xl transition-all hover:shadow-2xl ${
                    plan.popular ? "border-pink-500/50 ring-2 ring-pink-500/20" : ""
                  } ${plan.bestValue ? "border-yellow-500/50 ring-2 ring-yellow-500/20" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-pink-500 to-blue-600 text-white text-[10px]">
                        Popular
                      </Badge>
                    </div>
                  )}
                  {plan.bestValue && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px]">
                        Best Value
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2 pt-6">
                    <CardTitle className="text-base sm:text-lg">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-2xl sm:text-3xl font-bold">{plan.price}</span>
                      <span className="text-xs sm:text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2 text-xs sm:text-sm">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-xs sm:text-sm">
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.limitations?.map((limitation) => (
                        <li
                          key={limitation}
                          className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground"
                        >
                          <span className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5 text-center">—</span>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <Button disabled className="w-full" size="sm">
                        Current Plan
                      </Button>
                    ) : canUpgrade ? (
                      <Button
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={loadingPlan === plan.id}
                        size="sm"
                        className={`w-full ${
                          plan.popular || plan.bestValue
                            ? "bg-gradient-to-r from-pink-500 to-blue-600 hover:opacity-90"
                            : ""
                        }`}
                      >
                        {loadingPlan === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            Upgrade
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button variant="outline" disabled className="w-full bg-transparent" size="sm">
                        {plan.id === "FREE" ? "Free Plan" : "N/A"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
