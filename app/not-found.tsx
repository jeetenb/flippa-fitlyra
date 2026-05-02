"use client"

import { motion } from "framer-motion"
import { Home, Dumbbell, Compass } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950/50 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: -mousePosition.x * 2,
            y: -mousePosition.y * 2,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-r from-cyan-600/30 to-blue-600/30 blur-3xl"
        />

        {/* Floating fitness elements */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: {
                duration: 3 + i * 0.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              rotate: {
                duration: 10 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              },
            }}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
          >
            <div className="text-white/10">
              <Dumbbell size={30 + i * 10} />
            </div>
          </motion.div>
        ))}

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* 404 Text with 3D effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <motion.h1
            animate={{
              textShadow: [
                "0 0 20px rgba(168, 85, 247, 0.5)",
                "0 0 40px rgba(168, 85, 247, 0.8)",
                "0 0 20px rgba(168, 85, 247, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="text-center text-[120px] font-black leading-none tracking-tighter text-transparent sm:text-[180px] md:text-[220px]"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            404
          </motion.h1>

          {/* Glitch effect overlay */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              x: [-2, 2, -2, 0],
              opacity: [0, 0.5, 0, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            <span className="text-[120px] font-black leading-none tracking-tighter text-cyan-400/50 sm:text-[180px] md:text-[220px]">
              404
            </span>
          </motion.div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            Looks like you{"'"}ve gone off track!
          </h2>
          <p className="mx-auto max-w-md text-base text-slate-400 sm:text-lg">
            Even the best athletes take a wrong turn sometimes. Let{"'"}s get you back to your fitness journey.
          </p>
        </motion.div>

        {/* Animated fitness icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mb-10"
        >
          <motion.div
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="relative"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-2xl shadow-purple-500/30 sm:h-32 sm:w-32">
              <Dumbbell className="h-12 w-12 text-white sm:h-16 sm:w-16" />
            </div>
          </motion.div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Button
            asChild
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-base font-semibold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
          >
            <Link href="/">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                <Home className="h-5 w-5" />
                Back to Home
              </span>
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-slate-700 bg-slate-900/50 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-purple-500 hover:bg-slate-800/50"
          >
            <Link href="/dashboard">
              <span className="flex items-center gap-2">
                <Compass className="h-5 w-5" />
                Go to Dashboard
              </span>
            </Link>
          </Button>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500"
        >
          <span>Quick links:</span>
          <Link
            href="/workout-plans"
            className="text-purple-400 transition-colors hover:text-purple-300 hover:underline"
          >
            Workouts
          </Link>
          <span>•</span>
          <Link href="/meal-plans" className="text-purple-400 transition-colors hover:text-purple-300 hover:underline">
            Meal Plans
          </Link>
          <span>•</span>
          <Link
            href="/health-assistant"
            className="text-purple-400 transition-colors hover:text-purple-300 hover:underline"
          >
            AI Assistant
          </Link>
          <span>•</span>
          <Link href="/contact" className="text-purple-400 transition-colors hover:text-purple-300 hover:underline">
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </div>
  )
}
