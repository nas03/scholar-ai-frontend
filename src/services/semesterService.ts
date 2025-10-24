// Semester service for managing semester operations
import { CreateSemesterRequest, Semester, UpdateSemesterRequest } from '../types';

export class SemesterService {
  private semesters: Semester[] = [];

  constructor(initialSemesters: Semester[] = []) {
    this.semesters = initialSemesters;
  }

  // Get all semesters
  getAllSemesters(): Semester[] {
    return [...this.semesters];
  }

  // Get semester by ID
  getSemesterById(id: string): Semester | undefined {
    return this.semesters.find(semester => semester.id === id);
  }

  // Get current semester (based on current date)
  getCurrentSemester(): Semester | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.semesters.find(semester => 
      semester.startDate <= today && semester.endDate >= today
    );
  }

  // Get upcoming semesters
  getUpcomingSemesters(): Semester[] {
    const today = new Date().toISOString().split('T')[0];
    return this.semesters.filter(semester => semester.startDate > today);
  }

  // Get past semesters
  getPastSemesters(): Semester[] {
    const today = new Date().toISOString().split('T')[0];
    return this.semesters.filter(semester => semester.endDate < today);
  }

  // Add new semester
  addSemester(semesterData: CreateSemesterRequest): Semester {
    const newSemester: Semester = {
      ...semesterData,
      id: Date.now().toString(),
    };
    this.semesters.push(newSemester);
    return newSemester;
  }

  // Update existing semester
  updateSemester(id: string, semesterData: UpdateSemesterRequest): Semester | null {
    const index = this.semesters.findIndex(semester => semester.id === id);
    if (index === -1) return null;

    this.semesters[index] = { ...this.semesters[index], ...semesterData };
    return this.semesters[index];
  }

  // Delete semester
  deleteSemester(id: string): boolean {
    const index = this.semesters.findIndex(semester => semester.id === id);
    if (index === -1) return false;

    this.semesters.splice(index, 1);
    return true;
  }

  // Sort semesters by start date
  getSortedSemesters(): Semester[] {
    return [...this.semesters].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  }

  // Get semesters by year
  getSemestersByYear(year: number): Semester[] {
    return this.semesters.filter(semester => 
      semester.startDate.startsWith(year.toString()) || 
      semester.endDate.startsWith(year.toString())
    );
  }

  // Set semesters (for initialization)
  setSemesters(semesters: Semester[]): void {
    this.semesters = [...semesters];
  }
}
