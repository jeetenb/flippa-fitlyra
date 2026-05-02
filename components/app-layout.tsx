"use client"

import type React from "react"

import { AppSidebar, MobileBottomNav, MobileHeader } from "@/components/app-sidebar"
import { motion } from "framer-motion"

interface AppLayoutProps {
  children: React.ReactNode
  user?: any
  metadata?: any
  title?: string
}

export function AppLayout({ children, user, metadata, title }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-white">
      {/* Desktop Sidebar */}
      <AppSidebar user={user} metadata={metadata} />

      {/* Mobile Header */}
      <MobileHeader title={title} />

      {/* Main Content */}
      <main className="lg:pl-[280px] pb-24 lg:pb-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}
