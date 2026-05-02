"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Sparkles } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PRODUCTS } from "@/lib/products"
import Link from "next/link"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const tiers = [
  {
    name: "Free",
    productId: PRODUCTS[0].id,
    description: "Get started with basic features",
    features: ["3 meal plans/month", "3 workout plans/month", "Basic progress tracking"],
    limitations: ["No AI assistant", "Limited exports"],
  },
  {
    name: "Pro Plan",
    productId: PRODUCTS[1].id,
    description: "Perfect for dedicated fitness enthusiasts - 100 plans/month, AI assistant, PDF exports",
    features: [
      "100 plans/month",
      "AI health assistant",
      "PDF exports",
      "Unlimited progress logs",
    ],
    highlighted: false,
  },
  {
    name: "Elite Plan",
    productId: PRODUCTS[2].id,
    description: "Maximum value for serious athletes - 300 plans/month, daily AI tips, advanced analytics",
    features: [
      "300 plans/month",
      "Everything in Pro",
      "Daily AI tips",
      "Advanced analytics",
    ],
    highlighted: true,
  },
  {
    name: "Lifetime Access",
    productId: PRODUCTS[3].id,
    description: "Pay once, use forever - All Elite features with lifetime access",
    features: [
      "Everything in Elite",
      "Never pay again",
      "Early access features",
      "Lifetime support",
    ],
    highlighted: false,
  },
]

export function PricingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (headingRef.current) {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
      })
    }

    if (cardsRef.current) {
      const cards = cardsRef.current.children
      gsap.from(cards, {
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 50,
        stagger: 0.15,
        duration: 0.6,
      })
    }
  }, [])

  return (
    <section id="pricing" ref={sectionRef} className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-sm font-medium text-accent mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Flexible Pricing</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">Choose Your Plan</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Select the perfect plan for your fitness journey. All plans include a 14-day money-back guarantee.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => {
            const product = PRODUCTS.find((p) => p.id === tier.productId)
            // Determine plan period text
            let periodText = ""
            if (product) {
              if (product.interval === "month" && product.intervalCount === 1) {
                periodText = "/month"
              } else if (product.interval === "month" && product.intervalCount && product.intervalCount > 1) {
                periodText = `/ ${product.intervalCount} months`
              } else if (product.interval === "year") {
                periodText = "/year"
              } else if (!product.interval) {
                periodText = "lifetime"
              }
            }

            return (
              <motion.div
                key={index}
                whileHover={{ y: tier.highlighted ? 0 : -5 }}
                transition={{ duration: 0.2 }}
                className={tier.highlighted ? "md:scale-105" : ""}
              >
                <Card
                  className={`h-full relative ${
                    tier.highlighted ? "border-primary border-2 shadow-lg shadow-primary/20" : "border-2"
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4">{tier.description}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold">
                        ${product ? (product.priceInCents / 100).toFixed(2) : "0.00"}
                      </span>
                      <span className="text-muted-foreground">
                        {periodText}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/auth/sign-up" passHref>
                      <Button
                        className="w-full"
                        variant={tier.highlighted ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
