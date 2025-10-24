// Mock data for initial application state
import { Course, CourseMaterial, GraduationRequirements, Note, Reminder, Semester, Tag, UserPreferences } from '../types';

// Default tags that come with the system
export const defaultTags: Tag[] = [
  { id: "1", name: "Algorithms", type: "default", color: "bg-blue-500" },
  { id: "2", name: "Data Structures", type: "default", color: "bg-green-500" },
  { id: "3", name: "Mathematics", type: "default", color: "bg-purple-500" },
  { id: "4", name: "Physics", type: "default", color: "bg-orange-500" },
  { id: "5", name: "Theory", type: "default", color: "bg-pink-500" },
  { id: "6", name: "Practice", type: "default", color: "bg-cyan-500" },
  { id: "7", name: "Exam Prep", type: "default", color: "bg-red-500" },
  { id: "8", name: "Assignment", type: "default", color: "bg-yellow-500" },
  { id: "9", name: "Project", type: "default", color: "bg-indigo-500" },
  { id: "10", name: "Review", type: "default", color: "bg-teal-500" },
];

// Initial semesters data
export const initialSemesters: Semester[] = [
  {
    id: "1",
    name: "Fall 2024",
    startDate: "2024-09-01",
    endDate: "2024-12-15"
  },
  {
    id: "2",
    name: "Spring 2025",
    startDate: "2025-01-15",
    endDate: "2025-05-15"
  }
];

// Initial courses data
export const initialCourses: Course[] = [
  {
    id: "1",
    name: "Computer Science 101",
    code: "CS101",
    instructor: "Dr. Sarah Johnson",
    students: 45,
    schedule: "Mon, Wed 9:00 AM",
    scheduleDetails: [
      { id: "1", day: "Monday", startTime: "09:00 AM", endTime: "10:00 AM" },
      { id: "2", day: "Wednesday", startTime: "09:00 AM", endTime: "10:00 AM" }
    ],
    location: "Room 101",
    color: "bg-blue-500",
    progress: 65,
    description: "Introduction to computer science fundamentals",
    credits: 4,
    semester: "Fall 2024",
    gpa: 3.5
  },
  {
    id: "2",
    name: "Advanced Mathematics",
    code: "MATH201",
    instructor: "Prof. Michael Chen",
    students: 32,
    schedule: "Tue, Thu 2:00 PM",
    scheduleDetails: [
      { id: "1", day: "Tuesday", startTime: "14:00 PM", endTime: "15:00 PM" },
      { id: "2", day: "Thursday", startTime: "14:00 PM", endTime: "15:00 PM" }
    ],
    location: "Room 201",
    color: "bg-purple-500",
    progress: 78,
    description: "Advanced calculus and mathematical analysis",
    credits: 3,
    semester: "Fall 2024",
    gpa: 3.8
  },
  {
    id: "3",
    name: "Data Structures",
    code: "CS202",
    instructor: "Dr. Emily Brown",
    students: 38,
    schedule: "Mon, Wed 2:00 PM",
    scheduleDetails: [
      { id: "1", day: "Monday", startTime: "14:00 PM", endTime: "15:00 PM" },
      { id: "2", day: "Wednesday", startTime: "14:00 PM", endTime: "15:00 PM" }
    ],
    location: "Room 102",
    color: "bg-green-500",
    progress: 42,
    description: "Advanced data structures and algorithms",
    credits: 4,
    semester: "Fall 2024",
    gpa: 3.2
  },
  {
    id: "4",
    name: "Physics II",
    code: "PHY102",
    instructor: "Dr. Robert Wilson",
    students: 50,
    schedule: "Tue, Thu 10:00 AM",
    scheduleDetails: [
      { id: "1", day: "Tuesday", startTime: "10:00 AM", endTime: "11:00 AM" },
      { id: "2", day: "Thursday", startTime: "10:00 AM", endTime: "11:00 AM" }
    ],
    location: "Room 301",
    color: "bg-orange-500",
    progress: 55,
    description: "Mechanics and thermodynamics",
    credits: 3,
    semester: "Fall 2024",
    gpa: 3.7
  }
];

// Initial notes data
export const initialNotes: Note[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    courseId: "1",
    courseCode: "CS101",
    date: "Oct 10, 2025",
    pages: 12,
    summarized: true,
    tags: ["Algorithms", "Theory"]
  },
  {
    id: "2",
    title: "Calculus Derivatives",
    courseId: "2",
    courseCode: "MATH201",
    date: "Oct 11, 2025",
    pages: 8,
    summarized: true,
    tags: ["Mathematics", "Theory"]
  },
  {
    id: "3",
    title: "Binary Trees and Graphs",
    courseId: "3",
    courseCode: "CS202",
    date: "Oct 12, 2025",
    pages: 15,
    summarized: false,
    tags: ["Data Structures", "Algorithms"]
  },
  {
    id: "4",
    title: "Newton's Laws",
    courseId: "4",
    courseCode: "PHY102",
    date: "Oct 12, 2025",
    pages: 10,
    summarized: true,
    tags: ["Physics", "Theory"]
  },
  {
    id: "5",
    title: "Sorting Algorithms",
    courseId: "1",
    courseCode: "CS101",
    date: "Oct 13, 2025",
    pages: 9,
    summarized: false,
    tags: ["Algorithms", "Practice"]
  }
];

// Initial materials data
export const initialMaterials: CourseMaterial[] = [
  {
    id: "1",
    courseId: "1",
    title: "Introduction to Programming - Lecture Slides",
    type: "pdf",
    uploadDate: "Oct 8, 2025",
    size: "2.4 MB",
    description: "Week 1 lecture slides"
  },
  {
    id: "2",
    courseId: "1",
    title: "Python Basics Tutorial",
    type: "video",
    url: "https://example.com/video1",
    uploadDate: "Oct 9, 2025",
    description: "Introductory video tutorial"
  },
  {
    id: "3",
    courseId: "2",
    title: "Calculus Textbook Chapter 3",
    type: "pdf",
    uploadDate: "Oct 10, 2025",
    size: "5.8 MB"
  }
];

// Initial reminders data
export const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "CS101 Assignment Due",
    description: "Complete programming assignment 3",
    dueDate: "2024-10-25",
    dueTime: "23:59",
    courseId: "1",
    courseCode: "CS101",
    priority: "high",
    completed: false,
    type: "assignment"
  },
  {
    id: "2",
    title: "MATH201 Midterm Exam",
    description: "Study chapters 1-5",
    dueDate: "2024-10-28",
    dueTime: "14:00",
    courseId: "2",
    courseCode: "MATH201",
    priority: "high",
    completed: false,
    type: "exam"
  }
];

// Initial user preferences
export const initialUserPreferences: UserPreferences = {
  personalInfo: {
    firstName: "Anh Son",
    lastName: "Nguyen",
    email: "nguyenanhson@gmail.com",
    studentId: "2023001",
    major: "Computer Science"
  },
  academic: {
    gpaScale: '4.0'
  },
  appearance: {
    theme: 'system'
  }
};

// Initial graduation requirements
export const initialGraduationRequirements: GraduationRequirements = {
  requiredCredits: 120,
  currentCredits: 0
};
