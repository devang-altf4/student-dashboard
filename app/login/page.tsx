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
import { Sparkles, KeyRound, Mail } from "lucide-react"
import { auth } from "@/lib/firebase-config"
import { signInWithEmailAndPassword } from "firebase/auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword)
      if (userCredential.user) {
        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        })
        router.push("/")
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.code ? getErrorMessage(error.code) : "An unknown error occurred"
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.'
      case 'auth/invalid-email':
        return 'Invalid email address format'
      case 'auth/user-disabled':
        return 'This account has been disabled'
      case 'auth/user-not-found':
        return 'No account found with this email'
      case 'auth/wrong-password':
        return 'Invalid password'
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.'
      default:
        return 'An error occurred during login. Please try again.'
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
            <CardTitle className="text-2xl font-bold gradient-text">Welcome Back</CardTitle>
            <Sparkles className="h-5 w-5 text-purple-400 animate-pulse-slow" />
          </div>
          <CardDescription className="text-blue-300">Enter your credentials to access the dashboard</CardDescription>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="flex items-center gap-2 text-blue-300">
                  <KeyRound className="h-4 w-4 text-purple-400" />
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-blue-300">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
