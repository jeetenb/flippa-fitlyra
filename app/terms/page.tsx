"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Sparkles } from "lucide-react"

export default function TermsPage() {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: November 28, 2025</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="lead text-lg text-muted-foreground mb-8">
                Welcome to FitLyra. By using our service, you agree to these Terms of Service. Please read them
                carefully.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-6">
                By accessing or using FitLyra, you agree to be bound by these Terms of Service and all applicable laws
                and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing
                this service.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground mb-6">
                FitLyra is an AI-powered fitness platform that provides personalized workout plans, meal plans, and
                health assistance. Our service uses artificial intelligence to create customized fitness recommendations
                based on your profile, goals, and preferences.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To use certain features of our service, you must create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">4. Subscription and Payments</h2>
              <h3 className="text-xl font-semibold mt-6 mb-3">Billing</h3>
              <p className="text-muted-foreground mb-4">
                Certain features of our service require a paid subscription. By subscribing, you agree to pay the fees
                indicated for your chosen plan. Fees are billed in advance on a recurring basis.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Cancellation</h3>
              <p className="text-muted-foreground mb-4">
                You may cancel your subscription at any time through your account settings. Cancellation will take
                effect at the end of your current billing period. No refunds will be provided for partial months.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Refunds</h3>
              <p className="text-muted-foreground mb-6">
                We offer a 30-day money-back guarantee for new subscribers. If you are not satisfied with our service
                within the first 30 days, contact us for a full refund.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">5. Health Disclaimer</h2>
              <p className="text-muted-foreground mb-6">
                FitLyra provides general fitness and nutrition information for educational purposes only. Our service is
                not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a
                qualified healthcare provider before starting any new exercise or nutrition program, especially if you
                have any health conditions or concerns.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">6. User Content</h2>
              <p className="text-muted-foreground mb-4">
                You retain ownership of any content you submit to our service. By submitting content, you grant us a
                worldwide, non-exclusive license to use, reproduce, and display such content for the purpose of
                providing our services.
              </p>
              <p className="text-muted-foreground mb-6">You agree not to submit content that:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Is illegal, harmful, or offensive</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains viruses or malicious code</li>
                <li>Violates the privacy of others</li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground mb-6">
                The FitLyra service, including its original content, features, and functionality, is owned by FitLyra
                and protected by international copyright, trademark, patent, trade secret, and other intellectual
                property laws.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-6">
                To the maximum extent permitted by law, FitLyra shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from
                your use of our service.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">9. Termination</h2>
              <p className="text-muted-foreground mb-6">
                We may terminate or suspend your account and access to our service immediately, without prior notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or
                for any other reason.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground mb-6">
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by
                posting the new Terms on this page. Your continued use of the service after changes constitutes
                acceptance of the new Terms.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the State of California,
                without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <ul className="list-none text-muted-foreground space-y-2">
                <li>Email: legal@fitlyra.com</li>
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
