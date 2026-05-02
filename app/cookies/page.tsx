"use client"

import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const cookieTypes = [
  {
    name: "Essential Cookies",
    description: "Required for the website to function properly. Cannot be disabled.",
    examples: ["Authentication", "Security", "Load balancing"],
  },
  {
    name: "Functional Cookies",
    description: "Enable enhanced functionality and personalization.",
    examples: ["Language preferences", "User settings", "Theme preferences"],
  },
  {
    name: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website.",
    examples: ["Page views", "Traffic sources", "User behavior"],
  },
  {
    name: "Marketing Cookies",
    description: "Used to track visitors across websites for advertising purposes.",
    examples: ["Ad targeting", "Retargeting", "Campaign measurement"],
  },
]

export default function CookiesPage() {
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
              <p className="text-muted-foreground">Last updated: November 28, 2025</p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="lead text-lg text-muted-foreground mb-8">
                This Cookie Policy explains how FitLyra uses cookies and similar technologies to recognize you when you
                visit our website. It explains what these technologies are and why we use them.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground mb-6">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                Cookies are widely used by website owners to make their websites work, or to work more efficiently, as
                well as to provide reporting information.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Types of Cookies We Use</h2>
              <div className="grid gap-4 my-8">
                {cookieTypes.map((type, index) => (
                  <Card key={index} className="border-2">
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2">{type.name}</h3>
                      <p className="text-muted-foreground mb-3">{type.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {type.examples.map((example, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h2 className="text-2xl font-bold mt-10 mb-4">How We Use Cookies</h2>
              <p className="text-muted-foreground mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>
                  <strong>Authentication:</strong> We use cookies to identify you when you visit our website and as you
                  navigate our website.
                </li>
                <li>
                  <strong>Security:</strong> We use cookies as an element of the security measures used to protect user
                  accounts.
                </li>
                <li>
                  <strong>Analysis:</strong> We use cookies to help us analyze the use and performance of our website
                  and services.
                </li>
                <li>
                  <strong>Preferences:</strong> We use cookies to store your preferences such as language and display
                  settings.
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">Third-Party Cookies</h2>
              <p className="text-muted-foreground mb-4">
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics
                and deliver advertisements on and through our service. These include:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>
                  <strong>Google Analytics:</strong> For website analytics and performance monitoring
                </li>
                <li>
                  <strong>Stripe:</strong> For payment processing
                </li>
                <li>
                  <strong>Vercel:</strong> For hosting and performance optimization
                </li>
              </ul>

              <h2 className="text-2xl font-bold mt-10 mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground mb-4">
                Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary
                from browser to browser, and from version to version. You can obtain up-to-date information about
                blocking and deleting cookies via these links:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
                <li>Chrome: https://support.google.com/chrome/answer/95647</li>
                <li>Firefox: https://support.mozilla.org/en-US/kb/cookies</li>
                <li>Safari: https://support.apple.com/guide/safari/manage-cookies</li>
                <li>Edge: https://support.microsoft.com/en-us/microsoft-edge</li>
              </ul>
              <p className="text-muted-foreground mb-6">
                Please note that blocking cookies may have a negative impact on the functions of many websites,
                including our site. Some features of the site may cease to be available to you.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Cookie Consent</h2>
              <p className="text-muted-foreground mb-6">
                When you first visit our website, you will be shown a cookie consent banner. You can choose to accept
                all cookies, reject non-essential cookies, or customize your preferences. You can change your cookie
                preferences at any time through your browser settings or by using our cookie preference center.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Updates to This Policy</h2>
              <p className="text-muted-foreground mb-6">
                We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or
                for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay
                informed about our use of cookies.
              </p>

              <h2 className="text-2xl font-bold mt-10 mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about our use of cookies, please contact us at:
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
