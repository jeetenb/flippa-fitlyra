"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Lost 30 lbs in 3 months",
    content:
      "FitLyra completely transformed my approach to fitness. The personalized workouts kept me motivated and I saw results faster than ever before.",
    rating: 5,
    image: "/woman-fitness-portrait.jpg",
  },
  {
    name: "Michael Chen",
    role: "Gained 15 lbs of muscle",
    content:
      "As a busy professional, I needed efficient workouts. The AI generated perfect plans that fit my schedule and equipment. Best investment in my health.",
    rating: 5,
    image: "/man-fitness-portrait.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Marathon Runner",
    content:
      "The progressive training plans helped me achieve my first marathon. The AI adaptation to my progress was impressive and kept me injury-free.",
    rating: 5,
    image: "/woman-runner-portrait.jpg",
  },
]

export function TestimonialsSection() {
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
        scale: 0.9,
        stagger: 0.15,
        duration: 0.6,
      })
    }
  }, [])

  return (
    <section id="testimonials" ref={sectionRef} className="py-20 md:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4"
          >
            <Star className="w-4 h-4 fill-primary" />
            <span>Success Stories</span>
          </motion.div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Real Results from Real People
          </h2>
          <p className="text-lg text-muted-foreground text-balance">
            Join thousands of users who have transformed their fitness journey with FitLyra.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
              <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <Quote className="w-10 h-10 text-primary/20" />
                  <p className="text-muted-foreground">{testimonial.content}</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
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
