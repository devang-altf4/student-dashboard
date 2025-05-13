"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PlusCircle, LogOut, LogIn, GraduationCap } from "lucide-react"
import { auth } from "@/lib/firebase-config"
import { onAuthStateChanged, signOut } from "firebase/auth"

export function DashboardHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  return (
    <header className="border-b border-purple-900/30 bg-[#0f0f17]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0f0f17]/60 sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-xl flex items-center gap-2 gradient-text">
          <GraduationCap className="h-6 w-6 text-purple-500 animate-float" />
          Student Dashboard
        </Link>
        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hover:bg-purple-900/20 text-blue-300 transition-all duration-300"
              >
                <Link href="/add-student">
                  <PlusCircle className="mr-2 h-4 w-4 text-purple-400" />
                  Add Student
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all duration-300"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
