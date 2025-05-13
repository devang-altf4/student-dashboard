"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Eye } from "lucide-react"
import { fetchStudents } from "@/lib/api"
import type { Student } from "@/lib/types"

export function StudentsList() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [courseFilter, setCourseFilter] = useState("")
  const router = useRouter()

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents()
        setStudents(data)
        setFilteredStudents(data)
      } catch (error) {
        console.error("Failed to fetch students:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStudents()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = students

    if (searchTerm) {
      result = result.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (courseFilter && courseFilter !== "all") {
      result = result.filter((student) => student.course === courseFilter)
    }

    setFilteredStudents(result)
  }, [searchTerm, courseFilter, students])

  const handleViewStudent = (id: string) => {
    router.push(`/student/${id}`)
  }

  const uniqueCourses = [...new Set(students.map((student) => student.course))]

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

  return (
    <Card className="card-hover dark-card glow-border">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search students..."
              className="pl-8 dark-input focus:ring-purple-500 focus:border-purple-500 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full md:w-[180px] dark-input text-blue-300 border-purple-700/50">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-purple-700/50">
              <SelectItem value="all" className="text-blue-300">
                All Courses
              </SelectItem>
              {uniqueCourses.map((course) => (
                <SelectItem key={course} value={course} className="text-blue-300">
                  {course.charAt(0).toUpperCase() + course.slice(1).replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full animate-pulse bg-purple-900/20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-purple-900/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-900/20 border-b border-purple-900/30">
                  <TableHead className="text-blue-300">Name</TableHead>
                  <TableHead className="text-blue-300">Email</TableHead>
                  <TableHead className="text-blue-300">Course</TableHead>
                  <TableHead className="text-blue-300">Enrollment Date</TableHead>
                  <TableHead className="text-blue-300">Grade</TableHead>
                  <TableHead className="text-blue-300 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="stagger-animation">
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-blue-300">
                      No students found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow
                      key={student.id}
                      className="animate-fade-in opacity-0 hover:bg-purple-900/10 transition-colors duration-200 border-b border-purple-900/20"
                    >
                      <TableCell className="font-medium text-white">{student.name}</TableCell>
                      <TableCell className="text-blue-300">{student.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCourseColor(student.course)}`}
                        >
                          {student.course.charAt(0).toUpperCase() + student.course.slice(1).replace("-", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-blue-300">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {student.grade ? <span className="font-semibold text-purple-300">{student.grade}</span> : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewStudent(student.id)}
                          className="hover:bg-purple-900/20 text-blue-300 hover:text-blue-200 transition-all duration-300"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
