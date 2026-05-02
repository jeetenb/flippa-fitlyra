"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Ticket,
  Search,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  ChevronRight,
  Inbox,
  Mail,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
  replies: Array<{
    id: string
    sender: "user" | "admin"
    sender_name: string
    message: string
    created_at: string
  }>
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

export default function MyTicketsPage() {
  const [email, setEmail] = useState("")
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: fetchError } = await supabase
        .from("contact_tickets")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .order("created_at", { ascending: false })

      if (fetchError) throw new Error(fetchError.message)

      setTickets(data || [])
      setHasSearched(true)
    } catch (err) {
      console.error("Error fetching tickets:", err)
      setError("Failed to fetch tickets. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

  const getReplyCount = (ticket: TicketType) => {
    return ticket.replies?.length || 0
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-blue-600/5" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-pink-500 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Contact
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-sm font-medium text-pink-600 mb-6">
              <Ticket className="w-4 h-4" />
              <span>Support Tickets</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">My Tickets</h1>
            <p className="text-lg text-muted-foreground">Enter your email to view and manage your support tickets.</p>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-xl mx-auto"
          >
            <Card className="border-2">
              <CardContent className="p-6">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-500" />
                      Email Address
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-blue-600 px-6"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </form>

                {error && (
                  <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Tickets List */}
      <section className="py-12 pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {hasSearched && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {tickets.length === 0 ? (
                    <Card className="border-2 border-dashed">
                      <CardContent className="p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                          <Inbox className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Tickets Found</h3>
                        <p className="text-muted-foreground mb-6">
                          We couldn't find any support tickets associated with this email address.
                        </p>
                        <Link href="/contact">
                          <Button className="bg-gradient-to-r from-pink-500 to-blue-600">Submit a New Ticket</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">
                          {tickets.length} Ticket{tickets.length !== 1 ? "s" : ""} Found
                        </h2>
                        <Link href="/contact">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            New Ticket
                          </Button>
                        </Link>
                      </div>

                      {tickets.map((ticket, index) => {
                        const StatusIcon = statusConfig[ticket.status].icon
                        const replyCount = getReplyCount(ticket)

                        return (
                          <motion.div
                            key={ticket.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link href={`/contact/my-tickets/${ticket.ticket_number}`}>
                              <Card className="border-2 hover:border-pink-500/50 hover:shadow-lg transition-all cursor-pointer group">
                                <CardContent className="p-4 sm:p-6">
                                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                    {/* Ticket Info */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <span className="font-mono text-sm font-semibold text-pink-500">
                                          {ticket.ticket_number}
                                        </span>
                                        <Badge
                                          variant="outline"
                                          className={`${statusConfig[ticket.status].color} text-xs`}
                                        >
                                          <StatusIcon className="w-3 h-3 mr-1" />
                                          {statusConfig[ticket.status].label}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className={`${priorityConfig[ticket.priority].color} text-xs`}
                                        >
                                          {priorityConfig[ticket.priority].label}
                                        </Badge>
                                      </div>

                                      <h3 className="font-semibold text-base sm:text-lg mb-1 truncate">
                                        {subjectLabels[ticket.subject] || ticket.subject}
                                      </h3>

                                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                        {ticket.message}
                                      </p>

                                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {formatDate(ticket.created_at)}
                                        </span>
                                        {replyCount > 0 && (
                                          <span className="flex items-center gap-1 text-pink-500">
                                            <MessageSquare className="w-3 h-3" />
                                            {replyCount} {replyCount === 1 ? "reply" : "replies"}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 group-hover:bg-pink-500/10 transition-colors shrink-0">
                                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-pink-500 transition-colors" />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {!hasSearched && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-pink-500/50" />
                  </div>
                  <h3 className="text-lg font-medium text-muted-foreground">
                    Enter your email above to find your tickets
                  </h3>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
