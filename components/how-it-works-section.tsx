"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { UserCircle, Settings, Sparkles, CheckCircle } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const steps = [
  {
    icon: UserCircle,
    title: "Create Your Profile",
    description: "Tell us about your fitness level, goals, and available equipment.",
    step: "01",
    gradient: "primary" as const,
  },
  {
    icon: Settings,
    title: "Customize Preferences",
    description: "Select workout types, duration, and specific muscle groups to target.",
    step: "02",
    gradient: "secondary" as const,
  },
  {
    icon: Sparkles,
    title: "AI Generates Plan",
    description: "Our advanced AI creates a personalized workout plan just for you.",
    step: "03",
    gradient: "accent" as const,
  },
  {
    icon: CheckCircle,
    title: "Start Training",
    description: "Follow your custom plan and track your progress as you transform.",
    step: "04",
    gradient: "purple" as const,
  },
]

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

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

    if (stepsRef.current) {
      const stepCards = stepsRef.current.children
      gsap.from(stepCards, {
        scrollTrigger: {
          trigger: stepsRef.current,
          start: "top 75%",
        },
        opacity: 0,
        x: -50,
        stagger: 0.2,
        duration: 0.6,
      })
    }
  }, [])

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full text-sm font-medium text-secondary mb-4"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simple Process</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">How FitLyra Works</h2>
          <p className="text-lg text-muted-foreground text-balance">
            Getting started with your personalized fitness journey is easy and takes just minutes.
          </p>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              <Card className="h-full border-2 hover:border-secondary/50 transition-all relative overflow-hidden hover:shadow-2xl hover:shadow-secondary/10 bg-card/50 backdrop-blur-sm">
                <div className="absolute top-4 right-4 text-6xl font-bold text-muted/10">{step.step}</div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Icon3D icon={step.icon} size="lg" gradient={step.gradient} className="mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-secondary/50 to-transparent z-20">
                  <motion.div
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="w-full h-full bg-gradient-to-r from-secondary to-transparent origin-left"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
