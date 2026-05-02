"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Target, Dumbbell, TrendingUp, Clock, Zap } from "lucide-react"
import { Icon3D } from "@/components/icon-3d"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced algorithms analyze your fitness profile to create optimal workout routines.",
    gradient: "primary" as const,
  },
  {
    icon: Target,
    title: "Goal-Oriented Plans",
    description: "Whether you want to build muscle, lose weight, or improve endurance, we have you covered.",
    gradient: "secondary" as const,
  },
  {
    icon: Dumbbell,
    title: "Equipment Flexibility",
    description: "Works with any equipment you have available, from full gym to bodyweight only.",
    gradient: "accent" as const,
  },
  {
    icon: TrendingUp,
    title: "Progressive Overload",
    description: "Automatically adjust workout intensity to ensure continuous improvement.",
    gradient: "purple" as const,
  },
  {
    icon: Clock,
    title: "Time Efficient",
    description: "Generate complete workout plans in seconds, not hours of research.",
    gradient: "primary" as const,
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Regenerate and modify your plan anytime based on feedback and progress.",
    gradient: "secondary" as const,
  },
]

export function FeaturesSection() {
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
        stagger: 0.1,
        duration: 0.6,
      })
    }
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4"
          >
            <Zap className="w-4 h-4" />
            <span>Powerful Features</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Our AI-powered platform provides all the tools you need to achieve your fitness goals.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              <Card className="h-full border-2 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon3D icon={feature.icon} size="md" gradient={feature.gradient} />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
