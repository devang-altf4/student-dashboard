import type { Student } from "./types"

// Mock student data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    course: "computer-science",
    enrollmentDate: "2023-09-01",
    grade: "A",
  },
  {
    id: "2",
    name: "Emma Johnson",
    email: "emma.j@example.com",
    course: "mathematics",
    enrollmentDate: "2023-08-15",
    grade: "B+",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.b@example.com",
    course: "physics",
    enrollmentDate: "2023-09-05",
    grade: "A-",
  },
  {
    id: "4",
    name: "Sophia Williams",
    email: "sophia.w@example.com",
    course: "biology",
    enrollmentDate: "2023-08-20",
    grade: "B",
  },
  {
    id: "5",
    name: "Daniel Jones",
    email: "daniel.j@example.com",
    course: "chemistry",
    enrollmentDate: "2023-09-10",
    grade: "A",
  },
  {
    id: "6",
    name: "Olivia Davis",
    email: "olivia.d@example.com",
    course: "computer-science",
    enrollmentDate: "2023-08-25",
    grade: "B+",
  },
  {
    id: "7",
    name: "James Miller",
    email: "james.m@example.com",
    course: "mathematics",
    enrollmentDate: "2023-09-15",
    grade: null,
  },
  {
    id: "8",
    name: "Ava Wilson",
    email: "ava.w@example.com",
    course: "physics",
    enrollmentDate: "2023-08-30",
    grade: "A-",
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fetch all students
export const fetchStudents = async (): Promise<Student[]> => {
  await delay(1000) // Simulate network delay
  return [...mockStudents]
}

// Fetch a student by ID
export const fetchStudentById = async (id: string): Promise<Student | null> => {
  await delay(800) // Simulate network delay
  const student = mockStudents.find((s) => s.id === id)
  return student || null
}

// Add a new student
export const addStudent = async (student: Omit<Student, "id">): Promise<Student> => {
  await delay(1200) // Simulate network delay

  const newStudent: Student = {
    ...student,
    id: String(mockStudents.length + 1),
  }

  mockStudents.push(newStudent)
  return newStudent
}

// Update a student
export const updateStudent = async (id: string, data: Partial<Student>): Promise<Student | null> => {
  await delay(1000) // Simulate network delay

  const index = mockStudents.findIndex((s) => s.id === id)
  if (index === -1) return null

  mockStudents[index] = { ...mockStudents[index], ...data }
  return mockStudents[index]
}
