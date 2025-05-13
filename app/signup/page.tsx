"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Sparkles, KeyRound, Mail, UserPlus } from "lucide-react"
import { auth } from "@/lib/firebase-config"
import { createUserWithEmailAndPassword } from "firebase/auth"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()
    const trimmedConfirmPassword = confirmPassword.trim()

    if (!trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (trimmedPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
      if (userCredential.user) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        })
        router.push("/")
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      const errorMessage = error.code ? getErrorMessage(error.code) : "An unknown error occurred"
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'This email is already registered'
      case 'auth/invalid-email':
        return 'Invalid email address format'
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled'
      case 'auth/weak-password':
        return 'Password is too weak'
      default:
        return 'An error occurred during sign up'
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0f17] to-[#1a1a2e]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-900/20 blur-3xl animate-float"></div>
        <div
          className="absolute top-20 -left-20 h-60 w-60 rounded-full bg-blue-900/20 blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-purple-800/20 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <Card className="w-full max-w-md animate-scale-in card-hover dark-card glow">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold gradient-text">Create Account</CardTitle>
            <UserPlus className="h-5 w-5 text-purple-400 animate-pulse-slow" />
          </div>
          <CardDescription className="text-blue-300">Enter your details to create a new account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-blue-300">
                <Mail className="h-4 w-4 text-purple-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2 text-blue-300">
                <KeyRound className="h-4 w-4 text-purple-400" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-blue-300">
                <KeyRound className="h-4 w-4 text-purple-400" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full button-hover bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-blue-300">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
