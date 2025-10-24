// Course hook for managing course state and operations
import { useCallback, useState } from 'react';
import { CourseService } from '../services';
import { Course, CreateCourseRequest, UpdateCourseRequest } from '../types';

export function useCourses(initialCourses: Course[] = []) {
  const [courseService] = useState(() => new CourseService(initialCourses));
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const addCourse = useCallback((courseData: CreateCourseRequest) => {
    const newCourse = courseService.addCourse(courseData);
    setCourses(courseService.getAllCourses());
    return newCourse;
  }, [courseService]);

  const updateCourse = useCallback((id: string, courseData: UpdateCourseRequest) => {
    const updatedCourse = courseService.updateCourse(id, courseData);
    if (updatedCourse) {
      setCourses(courseService.getAllCourses());
    }
    return updatedCourse;
  }, [courseService]);

  const deleteCourse = useCallback((id: string) => {
    const success = courseService.deleteCourse(id);
    if (success) {
      setCourses(courseService.getAllCourses());
    }
    return success;
  }, [courseService]);

  const getCourseById = useCallback((id: string) => {
    return courseService.getCourseById(id);
  }, [courseService]);

  const getCoursesBySemester = useCallback((semester: string) => {
    return courseService.getCoursesBySemester(semester);
  }, [courseService]);

  const calculateSemesterGPA = useCallback((semester: string) => {
    return courseService.calculateSemesterGPA(semester);
  }, [courseService]);

  const calculateOverallGPA = useCallback(() => {
    return courseService.calculateOverallGPA();
  }, [courseService]);

  const getTotalCredits = useCallback(() => {
    return courseService.getTotalCredits();
  }, [courseService]);

  return {
    courses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    getCoursesBySemester,
    calculateSemesterGPA,
    calculateOverallGPA,
    getTotalCredits,
  };
}
