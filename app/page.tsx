import { DashboardHeader } from "@/components/dashboard-header"
import { StudentsList } from "@/components/students-list"
import { Sparkles } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#0f0f17] to-[#1a1a2e]">
      <DashboardHeader />
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="animate-slide-in">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight gradient-text glow-text">Student Dashboard</h1>
            <Sparkles className="h-6 w-6 text-purple-400 animate-pulse-slow" />
          </div>
          <p className="text-blue-300 mb-8 max-w-2xl">
            Welcome to the student management system. View and manage your students from this sleek and interactive
            dashboard.
          </p>
        </div>
        <div className="animate-scale-in">
          <StudentsList />
        </div>
      </main>
    </div>
  )
}
