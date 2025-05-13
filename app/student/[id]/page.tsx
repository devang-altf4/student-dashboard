"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { fetchStudentById } from "@/lib/api"
import { auth } from "@/lib/firebase-config"
import { onAuthStateChanged } from "firebase/auth"
import type { Student } from "@/lib/types"
import { UserCircle, Mail, BookOpen, Calendar, GraduationCap, ArrowLeft, Edit } from "lucide-react"

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to view student details.",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      // Fetch student data
      const loadStudent = async () => {
        try {
          const data = await fetchStudentById(params.id)
          setStudent(data)
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load student details.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      loadStudent()
    })

    return () => unsubscribe()
  }, [params.id, router, toast])

  // Function to get course color
  const getCourseColor = (course: string) => {
    const colors: Record<string, string> = {
      "computer-science": "bg-purple-900/30 text-purple-300",
      mathematics: "bg-blue-900/30 text-blue-300",
      physics: "bg-indigo-900/30 text-indigo-300",
      biology: "bg-violet-900/30 text-violet-300",
      chemistry: "bg-fuchsia-900/30 text-fuchsia-300",
    }
    return colors[course] || "bg-gray-800 text-gray-300"
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f0f17] to-[#1a1a2e]">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-6 px-4">
          <Card className="max-w-2xl mx-auto card-hover dark-card glow-border">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 animate-pulse bg-purple-900/20" />
              <Skeleton className="h-4 w-1/2 animate-pulse bg-purple-900/20" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full animate-pulse bg-purple-900/20" />
              <Skeleton className="h-4 w-full animate-pulse bg-purple-900/20" />
              <Skeleton className="h-4 w-3/4 animate-pulse bg-purple-900/20" />
              <Skeleton className="h-4 w-1/2 animate-pulse bg-purple-900/20" />
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f0f17] to-[#1a1a2e]">
        <DashboardHeader />
        <main className="flex-1 container mx-auto py-6 px-4">
          <Card className="max-w-2xl mx-auto animate-scale-in card-hover dark-card glow-border">
            <CardHeader>
              <CardTitle className="text-white">Student Not Found</CardTitle>
              <CardDescription className="text-blue-300">
                The student you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all duration-300"
              >
                Back to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f0f17] to-[#1a1a2e]">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Card className="max-w-2xl mx-auto animate-scale-in card-hover dark-card glow-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <UserCircle className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl gradient-text">{student.name}</CardTitle>
                  <CardDescription className="text-blue-300">Student ID: {student.id}</CardDescription>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCourseColor(student.course)}`}>
                {student.course.charAt(0).toUpperCase() + student.course.slice(1).replace("-", " ")}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3 animate-slide-in opacity-0" style={{ animationDelay: "0.1s" }}>
                <Mail className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-300">Email</h3>
                  <p className="font-medium text-white">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 animate-slide-in opacity-0" style={{ animationDelay: "0.2s" }}>
                <BookOpen className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-300">Course</h3>
                  <p className="font-medium text-white">
                    {student.course.charAt(0).toUpperCase() + student.course.slice(1).replace("-", " ")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 animate-slide-in opacity-0" style={{ animationDelay: "0.3s" }}>
                <Calendar className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-300">Enrollment Date</h3>
                  <p className="font-medium text-white">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 animate-slide-in opacity-0" style={{ animationDelay: "0.4s" }}>
                <GraduationCap className="h-5 w-5 text-purple-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-300">Grade</h3>
                  <p className="font-medium text-white">{student.grade || "Not assigned"}</p>
                </div>
              </div>
            </div>

            <div
              className="mt-6 pt-6 border-t border-purple-900/30 animate-slide-in opacity-0"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="text-lg font-medium mb-2 text-blue-300">Student Performance</h3>
              <div className="h-32 bg-purple-900/20 rounded-md flex items-center justify-center text-blue-400">
                Performance chart will be displayed here
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between animate-slide-in opacity-0" style={{ animationDelay: "0.6s" }}>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/student/${student.id}/edit`)}
              className="border-blue-700 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 transition-all duration-300"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Student
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
