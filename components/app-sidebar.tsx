"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Dumbbell,
  Utensils,
  MessageSquare,
  TrendingUp,
  Settings,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Home,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

interface AppSidebarProps {
  user?: any
  metadata?: any
}

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Workout Plans",
    href: "/workout-plans",
    icon: Dumbbell,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
  },
  {
    name: "Meal Plans",
    href: "/meal-plans",
    icon: Utensils,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "Health Assistant",
    href: "/health-assistant",
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Progress",
    href: "/progress",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
]

const bottomNavItems = [
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10",
  },
  {
    name: "Billing",
    href: "/billing",
    icon: CreditCard,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
]

export function AppSidebar({ user, metadata }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const subscriptionPlan = metadata?.subscription_plan || "FREE"
  const isLifetime = metadata?.lifetime_access || false

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-white/20 bg-white/60 backdrop-blur-xl lg:flex"
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-white/20 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-blue-600">
              <Image src="/icon/icon.png" alt="FitLyra Logo" width={40} height={40} />
            </div>
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-lg font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent"
                >
                  FitLyra
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="h-8 w-8 shrink-0">
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-200",
                  isActive
                    ? `${item.bgColor} ${item.color} font-medium shadow-sm`
                    : "text-gray-600 hover:bg-gray-100/50",
                )}
              >
                <Icon className={cn("h-5 w-5 shrink-0", isActive ? item.color : "text-gray-500")} />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.href}>{linkContent}</div>
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/20 p-3">
          {/* Subscription Badge */}
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-3 rounded-xl bg-gradient-to-br from-pink-500/10 to-blue-600/10 p-3"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{isLifetime ? "Lifetime" : subscriptionPlan} Plan</span>
                </div>
                {subscriptionPlan === "FREE" && (
                  <Link href="/billing">
                    <Button
                      size="sm"
                      className="mt-2 w-full bg-gradient-to-r from-pink-500 to-blue-600 text-white hover:opacity-90"
                    >
                      Upgrade Now
                    </Button>
                  </Link>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Settings & Billing */}
          <div className="space-y-1">
            {bottomNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                    isActive ? `${item.bgColor} ${item.color} font-medium` : "text-gray-600 hover:bg-gray-100/50",
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive ? item.color : "text-gray-500")} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )

              if (isCollapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.href}>{linkContent}</div>
            })}
          </div>

          {/* Sign Out Button */}
          <div className="mt-3 pt-3 border-t border-white/20">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className="w-full h-10 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-medium">
                  Sign Out
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                {isLoading ? "Signing out..." : "Sign Out"}
              </Button>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}

// Mobile Bottom Navigation
export function MobileBottomNav() {
  const pathname = usePathname()

  const mobileNavItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Workouts", href: "/workout-plans", icon: Dumbbell },
    { name: "Meals", href: "/meal-plans", icon: Utensils },
    { name: "Chat", href: "/health-assistant", icon: MessageSquare },
    { name: "Progress", href: "/progress", icon: TrendingUp },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-white/80 backdrop-blur-xl lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all",
                isActive ? "text-pink-600" : "text-gray-500",
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                  isActive && "bg-gradient-to-br from-pink-500/20 to-blue-600/20",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-pink-600")} />
              </motion.div>
              <span className={cn("text-[10px] font-medium", isActive && "text-pink-600")}>{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

// Mobile Header
export function MobileHeader({ title }: { title?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/20 bg-white/60 backdrop-blur-xl px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-blue-600">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
            {title || "FitLyra"}
          </span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
          <Settings className="h-5 w-5" />
        </Button>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-14 right-4 z-50 w-48 rounded-xl border border-white/20 bg-white/90 backdrop-blur-xl shadow-xl lg:hidden"
            >
              <div className="p-2 space-y-1">
                <Link
                  href="/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 hover:bg-gray-100/50"
                  onClick={() => setShowMenu(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </Link>
                <Link
                  href="/billing"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-gray-600 hover:bg-gray-100/50"
                  onClick={() => setShowMenu(false)}
                >
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm">Billing</span>
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">{isLoading ? "Signing out..." : "Sign Out"}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
