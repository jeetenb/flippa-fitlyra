"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  User,
  Shield,
  MessageSquare,
  Copy,
  Check,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface Reply {
  id: string
  sender: "user" | "admin"
  sender_name: string
  message: string
  created_at: string
}

interface TicketType {
  id: string
  ticket_number: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "normal" | "high" | "urgent"
  created_at: string
  updated_at: string
  replies: Reply[]
}

const statusConfig = {
  open: { label: "Open", color: "bg-blue-500/10 text-blue-600 border-blue-500/30", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/30", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-500/10 text-green-600 border-green-500/30", icon: CheckCircle2 },
  closed: { label: "Closed", color: "bg-gray-500/10 text-gray-600 border-gray-500/30", icon: CheckCircle2 },
}

const priorityConfig = {
  low: { label: "Low", color: "bg-gray-500/10 text-gray-600" },
  normal: { label: "Normal", color: "bg-blue-500/10 text-blue-600" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-600" },
  urgent: { label: "Urgent", color: "bg-red-500/10 text-red-600" },
}

const subjectLabels: Record<string, string> = {
  general: "General Inquiry",
  support: "Technical Support",
  billing: "Billing Question",
  feedback: "Feedback",
  partnership: "Partnership",
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketNumber = params.ticketNumber as string

  const [ticket, setTicket] = useState<TicketType | null>(null)
  const [email, setEmail] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [ticket?.replies])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsVerifying(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("contact_tickets")
        .select("*")
        .eq("ticket_number", ticketNumber)
        .eq("email", email.toLowerCase().trim())
        .maybeSingle()

      if (fetchError) throw new Error(fetchError.message)

      if (!data) {
        setError("No ticket found with this ticket number and email combination.")
        return
      }

      setTicket(data)
      setIsVerified(true)
    } catch (err) {
      console.error("Error verifying ticket:", err)
      setError("Failed to verify ticket. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !ticket) return

    setIsSending(true)

    try {
      const newReply: Reply = {
        id: crypto.randomUUID(),
        sender: "user",
        sender_name: `${ticket.first_name} ${ticket.last_name}`,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
      }

      const updatedReplies = [...(ticket.replies || []), newReply]

      const { error: updateError } = await supabase
        .from("contact_tickets")
        .update({
          replies: updatedReplies,
          updated_at: new Date().toISOString(),
          status: ticket.status === "resolved" || ticket.status === "closed" ? "open" : ticket.status,
        })
        .eq("id", ticket.id)

      if (updateError) throw new Error(updateError.message)

      setTicket({
        ...ticket,
        replies: updatedReplies,
        status: ticket.status === "resolved" || ticket.status === "closed" ? "open" : ticket.status,
      })
      setNewMessage("")
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const copyTicketNumber = async () => {
    await navigator.clipboard.writeText(ticketNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    }
  }

  // Group messages by date
  const getGroupedMessages = () => {
    if (!ticket) return []

    const allMessages = [
      {
        id: "original",
        sender: "user" as const,
        sender_name: `${ticket.first_name} ${ticket.last_name}`,
        message: ticket.message,
        created_at: ticket.created_at,
        isOriginal: true,
      },
      ...(ticket.replies || []).map((r) => ({ ...r, isOriginal: false })),
    ]

    const groups: { date: string; messages: typeof allMessages }[] = []
    let currentDate = ""

    allMessages.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString()
      if (msgDate !== currentDate) {
        currentDate = msgDate
        groups.push({ date: msg.created_at, messages: [msg] })
      } else {
        groups[groups.length - 1].messages.push(msg)
      }
    })

    return groups
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <Link
                href="/contact/my-tickets"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pink-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to My Tickets
              </Link>
            </motion.div>

            {!isVerified ? (
              /* Email Verification */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="border-2 max-w-md mx-auto">
                  <CardContent className="p-6 sm:p-8">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-8 h-8 text-pink-500" />
                      </div>
                      <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
                      <p className="text-sm text-muted-foreground">
                        Enter the email address associated with ticket{" "}
                        <span className="font-mono font-semibold text-pink-500">{ticketNumber}</span>
                      </p>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-blue-600"
                        disabled={isVerifying}
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          "View Ticket"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : ticket ? (
              /* Ticket Detail & Chat */
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                {/* Ticket Header */}
                <Card className="border-2">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <button
                            onClick={copyTicketNumber}
                            className="font-mono text-lg font-semibold text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-2"
                          >
                            {ticket.ticket_number}
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <Badge variant="outline" className={statusConfig[ticket.status].color}>
                            {statusConfig[ticket.status].label}
                          </Badge>
                          <Badge variant="outline" className={priorityConfig[ticket.priority].color}>
                            {priorityConfig[ticket.priority].label}
                          </Badge>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-bold mb-2">
                          {subjectLabels[ticket.subject] || ticket.subject}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {ticket.first_name} {ticket.last_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Created {formatDate(ticket.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Messages */}
                <Card className="border-2">
                  <CardContent className="p-0">
                    {/* Messages Container */}
                    <div className="h-[400px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-6">
                      {getGroupedMessages().map((group, groupIndex) => (
                        <div key={groupIndex}>
                          {/* Date Header */}
                          <div className="flex items-center justify-center mb-4">
                            <div className="bg-muted/50 px-3 py-1 rounded-full text-xs text-muted-foreground">
                              {formatDateHeader(group.date)}
                            </div>
                          </div>

                          {/* Messages */}
                          <div className="space-y-4">
                            {group.messages.map((msg, msgIndex) => (
                              <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: msgIndex * 0.05 }}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-[85%] sm:max-w-[75%] ${
                                    msg.sender === "user"
                                      ? "bg-gradient-to-br from-pink-500 to-blue-600 text-white rounded-2xl rounded-br-md"
                                      : "bg-muted/50 rounded-2xl rounded-bl-md"
                                  }`}
                                >
                                  <div className="p-3 sm:p-4">
                                    {/* Sender info for admin messages */}
                                    {msg.sender === "admin" && (
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                                          <Shield className="w-3 h-3 text-pink-500" />
                                        </div>
                                        <span className="text-xs font-medium text-pink-500">FitLyra Support</span>
                                      </div>
                                    )}

                                    {/* Original message indicator */}
                                    {"isOriginal" in msg && msg.isOriginal && (
                                      <div className="flex items-center gap-1 mb-2 text-xs opacity-75">
                                        <MessageSquare className="w-3 h-3" />
                                        Original Message
                                      </div>
                                    )}

                                    <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>

                                    <div
                                      className={`text-xs mt-2 ${msg.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}
                                    >
                                      {formatTime(msg.created_at)}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    {ticket.status === "open" || ticket.status === "in_progress" ? (
                      <div className="border-t p-4">
                        <form onSubmit={handleSendMessage} className="flex gap-3">
                          <Textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="min-h-[44px] max-h-32 resize-none flex-1"
                            rows={1}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                if (newMessage.trim()) {
                                  handleSendMessage(e)
                                }
                              }
                            }}
                          />
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-pink-500 to-blue-600 px-4 self-end"
                            disabled={isSending || !newMessage.trim()}
                          >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          </Button>
                        </form>
                        <p className="text-xs text-muted-foreground mt-2">
                          Press Enter to send, Shift + Enter for new line
                        </p>
                      </div>
                    ) : (
                      <div className="border-t p-4 text-center">
                        <p className="text-sm text-muted-foreground">
                          This ticket is {ticket.status}. To continue the conversation, please open a new ticket.
                        </p>
                        <Link href="/contact">
                          <Button variant="outline" className="mt-3 bg-transparent">
                            Open New Ticket
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
