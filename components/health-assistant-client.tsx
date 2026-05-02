"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Bot, User, Sparkles, Lock, Dumbbell, Apple, Brain, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Icon3D } from "@/components/icon-3d"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { AppLayout } from "@/components/app-layout"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

interface HealthAssistantClientProps {
  user: SupabaseUser
  profile: {
    full_name?: string
    fitness_goals?: string[]
    fitness_level?: string
    weight?: number
    height?: number
    age?: number
  } | null
  chatHistory: Message[]
  hasAccess: boolean
  subscriptionPlan: string
  metadata?: any
}

const quickSuggestions = [
  { icon: Apple, text: "High-protein breakfast under 500 calories", color: "from-green-500 to-emerald-400" },
  { icon: Dumbbell, text: "20-minute home workout", color: "from-blue-500 to-cyan-400" },
  { icon: Brain, text: "Help me stay motivated this week", color: "from-purple-500 to-pink-400" },
  { icon: Zap, text: "Quick post-workout recovery tips", color: "from-orange-500 to-yellow-400" },
]

export function HealthAssistantClient({
  user,
  profile,
  chatHistory,
  hasAccess,
  subscriptionPlan,
  metadata,
}: HealthAssistantClientProps) {
  const [messages, setMessages] = useState<Message[]>(chatHistory)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !hasAccess) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/health-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          profile,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        created_at: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickSuggestion = (text: string) => {
    if (!hasAccess) return
    setInput(text)
    inputRef.current?.focus()
  }

  if (!hasAccess) {
    return (
      <AppLayout user={user} metadata={metadata} title="Health Assistant">
        <div className="px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="relative inline-block mb-8">
              <Icon3D icon={Lock} size="xl" gradient="primary" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-blue-600 bg-clip-text text-transparent">
              Unlock AI Health Assistant
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8">
              Get personalized health advice, workout tips, and nutrition guidance from your AI-powered health coach.
              Upgrade to Pro or higher to access this feature.
            </p>

            <Card className="bg-white/60 backdrop-blur-xl border-white/20 shadow-xl">
              <CardContent className="p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {quickSuggestions.map((suggestion, i) => (
                    <div key={i} className="p-4 rounded-xl bg-gray-100/50 border border-gray-200/50">
                      <suggestion.icon className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">{suggestion.text}</p>
                    </div>
                  ))}
                </div>

                <Link href="/billing">
                  <Button size="lg" className="w-full bg-gradient-to-r from-pink-500 to-blue-600 hover:opacity-90">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upgrade to Pro - $9.99/month
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout user={user} metadata={metadata} title="Health Assistant">
      <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen">
        {/* Chat Header - Desktop only (mobile has AppLayout header) */}
        <div className="hidden lg:flex items-center justify-between border-b border-white/20 bg-white/40 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold">AI Health Assistant</h1>
              <p className="text-xs text-gray-500">Powered by Groq AI</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-blue-600/10 border border-pink-500/20">
            <span className="text-xs font-medium text-pink-600">{subscriptionPlan}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 lg:py-12"
              >
                <div className="relative inline-block mb-6">
                  <Icon3D icon={Bot} size="xl" gradient="primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Hi{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
                </h2>
                <p className="text-gray-500 mb-8 text-sm sm:text-base">
                  I'm your AI health assistant. Ask me anything about nutrition, workouts, or wellness.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {quickSuggestions.map((suggestion, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuickSuggestion(suggestion.text)}
                      className="p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 hover:border-pink-500/30 hover:bg-white/80 transition-all text-left group"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center mb-2`}
                      >
                        <suggestion.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm font-medium group-hover:text-pink-600 transition-colors">
                        {suggestion.text}
                      </p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-pink-500 to-blue-600 text-white"
                            : "bg-white/80 backdrop-blur-sm border border-white/40 shadow-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-blue-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-pink-500/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-pink-500/60 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-pink-500/60 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input - positioned above bottom nav on mobile */}
        <div className="border-t border-white/20 bg-white/60 backdrop-blur-xl mb-20 lg:mb-0">
          <div className="px-4 py-4 max-w-3xl mx-auto">
            {messages.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                {quickSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickSuggestion(suggestion.text)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs rounded-full bg-gray-100/50 hover:bg-gray-200/50 border border-gray-200/50 hover:border-pink-500/30 transition-all"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about health, nutrition, or fitness..."
                className="flex-1 bg-white/80 border-white/40 focus:border-pink-500/50 rounded-xl"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-pink-500 to-blue-600 hover:opacity-90 rounded-xl w-12"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
