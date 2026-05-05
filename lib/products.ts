export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  interval?: "month" | "year" | null // null for one-time
  intervalCount?: number
}

// FitForge AI Pricing Plans
export const PRODUCTS: Product[] = [
  {
    id: "FREE",
    name: "Free",
    description: "Get started with basic features",
    priceInCents: 0,
    interval: null, // One-time payment
  },
  {
    id: "PRO",
    name: "Pro Plan",
    description: "Perfect for dedicated fitness enthusiasts - 100 plans/month, AI assistant, PDF exports",
    priceInCents: 999, // $9.99
    interval: "month",
    intervalCount: 1,
  },
  {
    id: "ELITE",
    name: "Elite Plan",
    description: "Maximum value for serious athletes - 300 plans/month, daily AI tips, advanced analytics",
    priceInCents: 2999, // $29.99
    interval: "month",
    intervalCount: 1,
  },
  {
    id: "LIFETIME",
    name: "Lifetime Access",
    description: "Pay once, use forever - All Elite features with lifetime access",
    priceInCents: 7900, // $79
    interval: null, // One-time payment
  },
]
