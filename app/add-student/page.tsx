"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sparkles, UserPlus, Calendar, BookOpen, Mail, GraduationCap } from "lucide-react"
import { auth } from "@/lib/firebase-config"
import { onAuthStateChanged } from "firebase/auth"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  course: z.string().min(1, { message: "Please select a course." }),
  enrollmentDate: z.string().min(1, { message: "Please select an enrollment date." }),
  grade: z.string().optional(),
})

export default function AddStudentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please login to add a new student.",
          variant: "destructive",
        })
        router.push("/login")
      } else {
        setIsAuthenticated(true)
      }
    })

    return () => unsubscribe()
  }, [router, toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      course: "",
      enrollmentDate: new Date().toISOString().split("T")[0],
      grade: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Student added",
        description: `${values.name} has been added successfully.`,
      })
      router.push("/")
    }, 1000)
  }

  if (!isAuthenticated) {
    return null // Don't render anything while checking authentication
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f0f17] to-[#1a1a2e]">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Card className="max-w-2xl mx-auto animate-scale-in card-hover dark-card glow-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl gradient-text">Add New Student</CardTitle>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse-slow" />
            </div>
            <CardDescription className="text-blue-300">
              Enter the student details to add them to the system.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="animate-slide-in opacity-0" style={{ animationDelay: "0.1s" }}>
                      <FormLabel className="flex items-center gap-2 text-blue-300">
                        <UserPlus className="h-4 w-4 text-purple-400" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="animate-slide-in opacity-0" style={{ animationDelay: "0.2s" }}>
                      <FormLabel className="flex items-center gap-2 text-blue-300">
                        <Mail className="h-4 w-4 text-purple-400" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john.doe@example.com"
                          type="email"
                          {...field}
                          className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem className="animate-slide-in opacity-0" style={{ animationDelay: "0.3s" }}>
                      <FormLabel className="flex items-center gap-2 text-blue-300">
                        <BookOpen className="h-4 w-4 text-purple-400" />
                        Course
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="dark-input text-blue-300 border-purple-700/50">
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#1a1a2e] border-purple-700/50">
                          <SelectItem value="computer-science" className="text-blue-300">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="mathematics" className="text-blue-300">
                            Mathematics
                          </SelectItem>
                          <SelectItem value="physics" className="text-blue-300">
                            Physics
                          </SelectItem>
                          <SelectItem value="biology" className="text-blue-300">
                            Biology
                          </SelectItem>
                          <SelectItem value="chemistry" className="text-blue-300">
                            Chemistry
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="enrollmentDate"
                  render={({ field }) => (
                    <FormItem className="animate-slide-in opacity-0" style={{ animationDelay: "0.4s" }}>
                      <FormLabel className="flex items-center gap-2 text-blue-300">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        Enrollment Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem className="animate-slide-in opacity-0" style={{ animationDelay: "0.5s" }}>
                      <FormLabel className="flex items-center gap-2 text-blue-300">
                        <GraduationCap className="h-4 w-4 text-purple-400" />
                        Current Grade (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="A, B, C, etc."
                          {...field}
                          className="dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
                        />
                      </FormControl>
                      <FormDescription className="text-blue-400/70">
                        Leave blank for new students without grades yet.
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter
                className="flex justify-between animate-slide-in opacity-0"
                style={{ animationDelay: "0.6s" }}
              >
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => router.back()}
                  className="border-purple-700 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-all duration-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-all duration-300"
                >
                  Add Student
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  )
}
