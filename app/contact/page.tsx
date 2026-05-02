"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sparkles,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Copy,
  Check,
  Ticket,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"

const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 24 hours",
    value: "support@fitlyra.com",
    href: "mailto:support@fitlyra.com",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Available Mon-Fri, 9am-6pm EST",
    value: "Start a conversation",
    href: "#",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "For urgent inquiries",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
]

const faqs = [
  {
    question: "How does the AI generate personalized plans?",
    answer:
      "Our AI analyzes your fitness level, goals, available equipment, and preferences to create customized workout and meal plans that adapt as you progress.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and never share your personal data with third parties. Your health information is protected and private.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied, contact us for a full refund.",
  },
]

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [ticketNumber, setTicketNumber] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: insertError } = await supabase
        .from("contact_tickets")
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        })
        .select("ticket_number")
        .single()

      if (insertError) {
        throw new Error(insertError.message)
      }

      setTicketNumber(data.ticket_number)
      setIsSubmitted(true)
    } catch (err) {
      console.error("Error submitting contact form:", err)
      setError("Failed to submit your message. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyTicketNumber = async () => {
    if (ticketNumber) {
      await navigator.clipboard.writeText(ticketNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-sm font-medium text-pink-600 mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">We'd Love to Hear From You</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Have a question, feedback, or just want to say hi? Our team is here to help.
            </p>

            <Link href="/contact/my-tickets">
              <Button variant="outline" className="bg-transparent border-2 border-pink-500/50 hover:bg-pink-500/10">
                <Ticket className="w-4 h-4 mr-2" />
                My Tickets
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="block"
              >
                <Card className="h-full text-center hover:shadow-lg transition-all border-2 hover:border-pink-500/50">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-4">
                      <method.icon className="w-7 h-7 text-pink-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <p className="text-pink-500 font-medium">{method.value}</p>
                  </CardContent>
                </Card>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Send Us a Message</h2>

              {isSubmitted && ticketNumber ? (
                <Card className="border-2 border-green-500/50">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>

                    {/* Ticket Number Display */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Your Ticket Number</p>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-2xl font-mono font-bold text-pink-500">{ticketNumber}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={copyTicketNumber}
                          className="h-8 w-8 bg-transparent"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">
                      Save this ticket number to track your request status.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/contact/my-tickets">
                        <Button variant="outline" className="bg-transparent">
                          <Ticket className="w-4 h-4 mr-2" />
                          View My Tickets
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => {
                          setIsSubmitted(false)
                          setTicketNumber(null)
                          setFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            subject: "",
                            message: "",
                          })
                        }}
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2">
                  <CardContent className="p-6">
                    {error && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            required
                            value={formData.lastName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          required
                          value={formData.subject}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help..."
                          rows={5}
                          required
                          value={formData.message}
                          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-500 to-blue-600"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* FAQs */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Office Info */}
              <Card className="mt-8 border-2 bg-gradient-to-br from-pink-500/5 to-blue-600/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Our Office</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        123 Fitness Street, Suite 100
                        <br />
                        San Francisco, CA 94102
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-pink-500 shrink-0" />
                      <span className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM EST</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
