"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Check, X, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
  const router = useRouter()

  // Password strength validation
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  }
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  // Check if user has a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setIsValidSession(!!session)
    }
    checkSession()

    // Listen for auth state changes (when user clicks reset link)
    const supabase = createClient()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (!Object.values(passwordChecks).every(Boolean)) {
      setError("Password does not meet requirements")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setIsSuccess(true)
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-primary/20" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    )
  }

  // Invalid session - show error
  if (!isValidSession) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <div className="text-center mb-2">
              <Link href="/" className="inline-flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Image src="/icon/icon.png" alt="FitLyra" width={40} height={40} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  FitLyra
                </span>
              </Link>
            </div>
            <Card className="border-border/50 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium">Invalid or expired link</p>
                    <p className="text-sm text-muted-foreground">
                      This password reset link is invalid or has expired. Please request a new one.
                    </p>
                  </div>
                  <Button asChild className="w-full mt-4">
                    <Link href="/auth/forgot-password">Request new link</Link>
                  </Button>
                  <Link
                    href="/auth/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Back to login
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Image src="/icon/icon.png" alt="FitLyra" width={40} height={40} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                FitLyra
              </span>
            </Link>
          </div>
          <Card className="border-border/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Set new password</CardTitle>
              <CardDescription>
                {isSuccess ? "Your password has been updated" : "Create a strong password for your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-medium">Password updated!</p>
                    <p className="text-sm text-muted-foreground">
                      Your password has been successfully changed. Redirecting to dashboard...
                    </p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1 mt-4 overflow-hidden">
                    <div className="bg-primary h-full animate-[progress_3s_linear]" style={{ width: "100%" }} />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword}>
                  <div className="flex flex-col gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                          <div
                            className={`flex items-center gap-1.5 ${passwordChecks.length ? "text-green-600" : "text-muted-foreground"}`}
                          >
                            {passwordChecks.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            8+ characters
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? "text-green-600" : "text-muted-foreground"}`}
                          >
                            {passwordChecks.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            Uppercase
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? "text-green-600" : "text-muted-foreground"}`}
                          >
                            {passwordChecks.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            Lowercase
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${passwordChecks.number ? "text-green-600" : "text-muted-foreground"}`}
                          >
                            {passwordChecks.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                            Number
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className={`h-11 pr-10 ${confirmPassword.length > 0 ? (passwordsMatch ? "border-green-500 focus-visible:ring-green-500" : "border-destructive focus-visible:ring-destructive") : ""}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {confirmPassword.length > 0 && (
                        <p
                          className={`text-xs flex items-center gap-1 ${passwordsMatch ? "text-green-600" : "text-destructive"}`}
                        >
                          {passwordsMatch ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                          {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                        </p>
                      )}
                    </div>
                    {error && (
                      <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </div>
                    )}
                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update password"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
