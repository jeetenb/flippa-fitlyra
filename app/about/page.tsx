"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Sparkles, Target, Heart, Users, Award, Zap } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description:
      "We're on a mission to make personalized fitness accessible to everyone, regardless of their background or experience level.",
  },
  {
    icon: Heart,
    title: "User-First",
    description:
      "Every feature we build starts with understanding what our users need to achieve their health and fitness goals.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We leverage cutting-edge AI technology to deliver personalized fitness experiences that adapt and evolve with you.",
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in the power of community and support each other in our fitness journeys.",
  },
]

const team = [
  {
    name: "Alex Chen",
    role: "CEO & Co-Founder",
    image: "/professional-asian-man-headshot.png",
    bio: "Former Google engineer with a passion for fitness tech.",
  },
  {
    name: "Sarah Mitchell",
    role: "CTO & Co-Founder",
    image: "/professional-woman-tech-headshot.png",
    bio: "AI researcher and competitive athlete.",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Product",
    image: "/professional-headshot-black-man.jpg",
    bio: "10+ years in fitness product development.",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Nutrition",
    image: "/latina-professional-headshot.png",
    bio: "Registered dietitian and wellness coach.",
  },
]

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "1M+", label: "Plans Generated" },
  { value: "4.9", label: "App Rating" },
  { value: "15+", label: "Countries" },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-blue-600/5" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-sm font-medium text-pink-600 mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Our Story</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Transforming Lives Through{" "}
              <span className="bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
                AI-Powered Fitness
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              FitLyra was born from a simple belief: everyone deserves access to personalized fitness guidance. We
              combine cutting-edge AI with expert knowledge to make that a reality.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At FitLyra, we believe that fitness should be personal, accessible, and effective. Traditional
                one-size-fits-all workout programs fail because they don't account for individual differences in goals,
                fitness levels, available equipment, and lifestyle constraints.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI-powered platform creates truly personalized workout and meal plans that adapt to your unique
                circumstances. Whether you're a beginner taking your first steps toward a healthier lifestyle or an
                experienced athlete looking to optimize performance, FitLyra has you covered.
              </p>
              <Button asChild className="bg-gradient-to-r from-pink-500 to-blue-600">
                <Link href="/auth/sign-up">Join FitLyra Today</Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src="/diverse-group-fitness-training-gym.jpg" alt="FitLyra community" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-pink-500 to-blue-600 rounded-2xl blur-2xl opacity-30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">These core principles guide everything we do at FitLyra.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-pink-500/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/10 to-blue-600/10 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-pink-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-muted-foreground">Passionate experts dedicated to revolutionizing fitness.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-4 mx-auto w-40 h-40">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-pink-500 to-blue-600 opacity-50" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-sm text-pink-500 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-pink-500/10 via-transparent to-blue-600/10">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Award className="w-16 h-16 mx-auto text-pink-500 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of users who have already started their fitness journey with FitLyra.
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-pink-500 to-blue-600">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
