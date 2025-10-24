// Course service for managing course-related operations
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';

export class CourseService {
  private courses: Course[] = [];

  constructor(initialCourses: Course[] = []) {
    this.courses = initialCourses;
  }

  // Get all courses
  getAllCourses(): Course[] {
    return [...this.courses];
  }

  // Get course by ID
  getCourseById(id: string): Course | undefined {
    return this.courses.find(course => course.id === id);
  }

  // Get courses by semester
  getCoursesBySemester(semester: string): Course[] {
    return this.courses.filter(course => course.semester === semester);
  }

  // Add new course
  addCourse(courseData: CreateCourseRequest): Course {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };
    this.courses.push(newCourse);
    return newCourse;
  }

  // Update existing course
  updateCourse(id: string, courseData: UpdateCourseRequest): Course | null {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return null;

    this.courses[index] = { ...this.courses[index], ...courseData };
    return this.courses[index];
  }

  // Delete course
  deleteCourse(id: string): boolean {
    const index = this.courses.findIndex(course => course.id === id);
    if (index === -1) return false;

    this.courses.splice(index, 1);
    return true;
  }

  // Calculate semester GPA
  calculateSemesterGPA(semester: string): number {
    const semesterCourses = this.courses.filter(
      c => c.semester === semester && c.gpa !== undefined && c.credits
    );
    
    if (semesterCourses.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    semesterCourses.forEach(course => {
      if (course.gpa && course.credits) {
        totalPoints += course.gpa * course.credits;
        totalCredits += course.credits;
      }
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  // Calculate overall GPA
  calculateOverallGPA(): number {
    const coursesWithGPA = this.courses.filter(c => c.gpa !== undefined && c.credits);
    
    if (coursesWithGPA.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    coursesWithGPA.forEach(course => {
      if (course.gpa && course.credits) {
        totalPoints += course.gpa * course.credits;
        totalCredits += course.credits;
      }
    });
    
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }

  // Get total credits
  getTotalCredits(): number {
    return this.courses.reduce((total, course) => total + (course.credits || 0), 0);
  }

  // Set courses (for initialization)
  setCourses(courses: Course[]): void {
    this.courses = [...courses];
  }
}
