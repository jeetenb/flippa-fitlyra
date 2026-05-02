"use client"

import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Icon3DProps {
  icon: LucideIcon
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  gradient?: "primary" | "secondary" | "accent" | "purple"
}

const sizeClasses = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
  xl: "w-28 h-28",
}

const iconSizes = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10",
  xl: "w-14 h-14",
}

const gradients = {
  primary: "from-primary via-primary/80 to-primary/60",
  secondary: "from-secondary via-secondary/80 to-secondary/60",
  accent: "from-accent via-accent/80 to-accent/60",
  purple: "from-purple-500 via-purple-400 to-pink-400",
}

export function Icon3D({ icon: Icon, className, size = "md", gradient = "primary" }: Icon3DProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotateY: 10, rotateX: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn("relative group cursor-pointer", sizeClasses[size], className)}
      style={{ perspective: "1000px" }}
    >
      {/* Outer glow ring */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-20 blur-lg group-hover:opacity-40 transition-opacity",
          gradients[gradient],
        )}
      />

      {/* Main 3D container */}
      <div
        className={cn(
          "relative w-full h-full rounded-2xl bg-gradient-to-br shadow-2xl flex items-center justify-center",
          "border border-white/10 backdrop-blur-sm",
          "transform-gpu transition-all duration-300",
          "group-hover:shadow-3xl",
          gradients[gradient],
        )}
        style={{
          transformStyle: "preserve-3d",
          transform: "translateZ(20px)",
        }}
      >
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />

        {/* Icon */}
        <Icon
          className={cn("relative z-10 text-white drop-shadow-lg", iconSizes[size])}
          style={{
            filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
          }}
        />

        {/* Bottom shadow layer */}
        <div
          className="absolute inset-0 rounded-2xl bg-black/20"
          style={{
            transform: "translateZ(-10px)",
            filter: "blur(8px)",
          }}
        />
      </div>

      {/* Shadow beneath */}
      <div
        className={cn(
          "absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-black/30 blur-md",
          "group-hover:w-full group-hover:h-3 transition-all",
        )}
      />
    </motion.div>
  )
}
