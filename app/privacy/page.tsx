"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Sparkles } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full text-sm font-medium text-pink-600 mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Legal</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: November 28, 2025</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="lead text-lg text-muted-foreground mb-8">
                At FitLyra, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use our service.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">1. Information We Collect</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">Personal Information</h3>
              <p className="text-muted-foreground mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Name and email address when you create an account</li>
                <li>Profile information such as age, weight, height, and fitness goals</li>
                <li>Payment information when you subscribe to our services</li>
                <li>Communications you send to us</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Health and Fitness Data</h3>
              <p className="text-muted-foreground mb-4">To provide personalized fitness plans, we collect:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Fitness level and exercise preferences</li>
                <li>Dietary restrictions and nutritional preferences</li>
                <li>Progress tracking data including workout logs</li>
                <li>Health goals and milestones</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Automatically Collected Information</h3>
              <p className="text-muted-foreground mb-6">
                When you use our service, we automatically collect certain information including your IP address,
                browser type, device information, and usage data.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Provide, maintain, and improve our services</li>
                <li>Generate personalized workout and meal plans</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the
                following circumstances:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>With service providers who assist in our operations</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With your consent</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-6">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in
                transit and at rest, regular security assessments, and strict access controls.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">5. Your Rights</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground mb-6">
                We retain your personal information for as long as your account is active or as needed to provide you
                services. We will retain and use your information as necessary to comply with our legal obligations,
                resolve disputes, and enforce our agreements.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">7. Children's Privacy</h2>
              <p className="text-muted-foreground mb-6">
                Our service is not intended for individuals under the age of 16. We do not knowingly collect personal
                information from children under 16. If we become aware that we have collected personal information from
                a child under 16, we will take steps to delete such information.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>Email: privacy@fitlyra.com</li>
                <li>Address: 123 Fitness Street, Suite 100, San Francisco, CA 94102</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
