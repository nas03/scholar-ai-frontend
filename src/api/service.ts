// API service layer that combines API client with local services
import {
    CourseService,
    MaterialService,
    NoteService,
    ReminderService,
    SemesterService,
    TagService,
    UserPreferencesService
} from '../services';
import {
    Course,
    CourseMaterial,
    CreateCourseRequest,
    CreateMaterialRequest,
    CreateNoteRequest,
    CreateReminderRequest,
    CreateSemesterRequest,
    CreateTagRequest,
    GraduationRequirements,
    Note,
    Reminder,
    Semester,
    Tag,
    UpdateCourseRequest,
    UpdateGraduationRequirementsRequest,
    UpdateMaterialRequest,
    UpdateNoteRequest,
    UpdateReminderRequest,
    UpdateSemesterRequest,
    UpdateUserPreferencesRequest,
    UserPreferences
} from '../types';
import { apiClient } from './client';

export class ApiService {
  private courseService: CourseService;
  private noteService: NoteService;
  private materialService: MaterialService;
  private reminderService: ReminderService;
  private semesterService: SemesterService;
  private tagService: TagService;
  private userPreferencesService: UserPreferencesService;
  private isOnline: boolean = navigator.onLine;

  constructor() {
    this.courseService = new CourseService();
    this.noteService = new NoteService();
    this.materialService = new MaterialService();
    this.reminderService = new ReminderService();
    this.semesterService = new SemesterService();
    this.tagService = new TagService();
    this.userPreferencesService = new UserPreferencesService(
      this.getDefaultUserPreferences(),
      this.getDefaultGraduationRequirements()
    );

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private getDefaultUserPreferences(): UserPreferences {
    return {
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
  }

  private getDefaultGraduationRequirements(): GraduationRequirements {
    return {
      requiredCredits: 120,
      currentCredits: 0
    };
  }

  // Sync local data with server when online
  private async syncData() {
    if (!this.isOnline) return;

    try {
      // Sync courses
      const coursesResponse = await apiClient.getCourses();
      if (coursesResponse.success) {
        this.courseService.setCourses(coursesResponse.data);
      }

      // Sync notes
      const notesResponse = await apiClient.getNotes();
      if (notesResponse.success) {
        this.noteService.setNotes(notesResponse.data);
      }

      // Sync materials
      const materialsResponse = await apiClient.getMaterials();
      if (materialsResponse.success) {
        this.materialService.setMaterials(materialsResponse.data);
      }

      // Sync reminders
      const remindersResponse = await apiClient.getReminders();
      if (remindersResponse.success) {
        this.reminderService.setReminders(remindersResponse.data);
      }

      // Sync semesters
      const semestersResponse = await apiClient.getSemesters();
      if (semestersResponse.success) {
        this.semesterService.setSemesters(semestersResponse.data);
      }

      // Sync tags
      const tagsResponse = await apiClient.getTags();
      if (tagsResponse.success) {
        this.tagService.setTags(tagsResponse.data);
      }

      // Sync user preferences
      const preferencesResponse = await apiClient.getUserPreferences();
      if (preferencesResponse.success) {
        this.userPreferencesService.setUserPreferences(preferencesResponse.data);
      }

      // Sync graduation requirements
      const graduationResponse = await apiClient.getGraduationRequirements();
      if (graduationResponse.success) {
        this.userPreferencesService.setGraduationRequirements(graduationResponse.data);
      }
    } catch (error) {
      console.error('Failed to sync data:', error);
    }
  }

  // Course methods
  async getCourses(): Promise<Course[]> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getCourses();
        if (response.success) {
          this.courseService.setCourses(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch courses from API:', error);
      }
    }
    return this.courseService.getAllCourses();
  }

  async createCourse(courseData: CreateCourseRequest): Promise<Course> {
    const course = this.courseService.addCourse(courseData);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.createCourse(courseData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to create course via API:', error);
      }
    }
    
    return course;
  }

  async updateCourse(id: string, courseData: UpdateCourseRequest): Promise<Course | null> {
    const course = this.courseService.updateCourse(id, courseData);
    
    if (this.isOnline && course) {
      try {
        const response = await apiClient.updateCourse(id, courseData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update course via API:', error);
      }
    }
    
    return course;
  }

  async deleteCourse(id: string): Promise<boolean> {
    const success = this.courseService.deleteCourse(id);
    
    if (this.isOnline && success) {
      try {
        const response = await apiClient.deleteCourse(id);
        return response.success;
      } catch (error) {
        console.error('Failed to delete course via API:', error);
      }
    }
    
    return success;
  }

  // Note methods
  async getNotes(): Promise<Note[]> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getNotes();
        if (response.success) {
          this.noteService.setNotes(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch notes from API:', error);
      }
    }
    return this.noteService.getAllNotes();
  }

  async createNote(noteData: CreateNoteRequest): Promise<Note> {
    const note = this.noteService.addNote(noteData);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.createNote(noteData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to create note via API:', error);
      }
    }
    
    return note;
  }

  async updateNote(id: string, noteData: UpdateNoteRequest): Promise<Note | null> {
    const note = this.noteService.updateNote(id, noteData);
    
    if (this.isOnline && note) {
      try {
        const response = await apiClient.updateNote(id, noteData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update note via API:', error);
      }
    }
    
    return note;
  }

  async deleteNote(id: string): Promise<boolean> {
    const success = this.noteService.deleteNote(id);
    
    if (this.isOnline && success) {
      try {
        const response = await apiClient.deleteNote(id);
        return response.success;
      } catch (error) {
        console.error('Failed to delete note via API:', error);
      }
    }
    
    return success;
  }

  // Material methods
  async getMaterials(): Promise<CourseMaterial[]> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getMaterials();
        if (response.success) {
          this.materialService.setMaterials(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch materials from API:', error);
      }
    }
    return this.materialService.getAllMaterials();
  }

  async createMaterial(materialData: CreateMaterialRequest): Promise<CourseMaterial> {
    const material = this.materialService.addMaterial(materialData);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.createMaterial(materialData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to create material via API:', error);
      }
    }
    
    return material;
  }

  async updateMaterial(id: string, materialData: UpdateMaterialRequest): Promise<CourseMaterial | null> {
    const material = this.materialService.updateMaterial(id, materialData);
    
    if (this.isOnline && material) {
      try {
        const response = await apiClient.updateMaterial(id, materialData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update material via API:', error);
      }
    }
    
    return material;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const success = this.materialService.deleteMaterial(id);
    
    if (this.isOnline && success) {
      try {
        const response = await apiClient.deleteMaterial(id);
        return response.success;
      } catch (error) {
        console.error('Failed to delete material via API:', error);
      }
    }
    
    return success;
  }

  // Reminder methods
  async getReminders(): Promise<Reminder[]> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getReminders();
        if (response.success) {
          this.reminderService.setReminders(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch reminders from API:', error);
      }
    }
    return this.reminderService.getAllReminders();
  }

  async createReminder(reminderData: CreateReminderRequest): Promise<Reminder> {
    const reminder = this.reminderService.addReminder(reminderData);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.createReminder(reminderData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to create reminder via API:', error);
      }
    }
    
    return reminder;
  }

  async updateReminder(id: string, reminderData: UpdateReminderRequest): Promise<Reminder | null> {
    const reminder = this.reminderService.updateReminder(id, reminderData);
    
    if (this.isOnline && reminder) {
      try {
        const response = await apiClient.updateReminder(id, reminderData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update reminder via API:', error);
      }
    }
    
    return reminder;
  }

  async deleteReminder(id: string): Promise<boolean> {
    const success = this.reminderService.deleteReminder(id);
    
    if (this.isOnline && success) {
      try {
        const response = await apiClient.deleteReminder(id);
        return response.success;
      } catch (error) {
        console.error('Failed to delete reminder via API:', error);
      }
    }
    
    return success;
  }

  // Semester methods
  async getSemesters(): Promise<Semester[]> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getSemesters();
        if (response.success) {
          this.semesterService.setSemesters(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch semesters from API:', error);
      }
    }
    return this.semesterService.getAllSemesters();
  }

  async createSemester(semesterData: CreateSemesterRequest): Promise<Semester> {
    const semester = this.semesterService.addSemester(semesterData);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.createSemester(semesterData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to create semester via API:', error);
      }
    }
    
    return semester;
  }

  async updateSemester(id: string, semesterData: UpdateSemesterRequest): Promise<Semester | null> {
    const semester = this.semesterService.updateSemester(id, semesterData);
    
    if (this.isOnline && semester) {
      try {
        const response = await apiClient.updateSemester(id, semesterData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update semester via API:', error);
      }
    }
    
    return semester;
  }

  async deleteSemester(id: string): Promise<boolean> {
    const success = this.semesterService.deleteSemester(id);
    
    if (this.isOnline && success) {
      try {
        const response = await apiClient.deleteSemester(id);
        return response.success;
      } catch (error) {
        console.error('Failed to delete semester via API:', error);
      }
    }
    
    return success;
  }

  // Tag methods
  async getTags(): Promise<Tag[]> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getTags();
        if (response.success) {
          this.tagService.setTags(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch tags from API:', error);
      }
    }
    return this.tagService.getAllTags();
  }

  async createTag(tagData: CreateTagRequest): Promise<Tag> {
    const tag = this.tagService.addTag(tagData);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.createTag(tagData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to create tag via API:', error);
      }
    }
    
    return tag;
  }

  async updateTag(id: string, tagData: Partial<Tag>): Promise<Tag | null> {
    const tag = this.tagService.updateTag(id, tagData);
    
    if (this.isOnline && tag) {
      try {
        const response = await apiClient.updateTag(id, tagData);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update tag via API:', error);
      }
    }
    
    return tag;
  }

  async deleteTag(id: string): Promise<boolean> {
    const success = this.tagService.deleteTag(id);
    
    if (this.isOnline && success) {
      try {
        const response = await apiClient.deleteTag(id);
        return response.success;
      } catch (error) {
        console.error('Failed to delete tag via API:', error);
      }
    }
    
    return success;
  }

  // User preferences methods
  async getUserPreferences(): Promise<UserPreferences> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getUserPreferences();
        if (response.success) {
          this.userPreferencesService.setUserPreferences(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch user preferences from API:', error);
      }
    }
    return this.userPreferencesService.getUserPreferences();
  }

  async updateUserPreferences(preferences: UpdateUserPreferencesRequest): Promise<UserPreferences> {
    const updatedPreferences = this.userPreferencesService.updateUserPreferences(preferences);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.updateUserPreferences(preferences);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update user preferences via API:', error);
      }
    }
    
    return updatedPreferences;
  }

  async getGraduationRequirements(): Promise<GraduationRequirements> {
    if (this.isOnline) {
      try {
        const response = await apiClient.getGraduationRequirements();
        if (response.success) {
          this.userPreferencesService.setGraduationRequirements(response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Failed to fetch graduation requirements from API:', error);
      }
    }
    return this.userPreferencesService.getGraduationRequirements();
  }

  async updateGraduationRequirements(requirements: UpdateGraduationRequirementsRequest): Promise<GraduationRequirements> {
    const updatedRequirements = this.userPreferencesService.updateGraduationRequirements(requirements);
    
    if (this.isOnline) {
      try {
        const response = await apiClient.updateGraduationRequirements(requirements);
        if (response.success) {
          return response.data;
        }
      } catch (error) {
        console.error('Failed to update graduation requirements via API:', error);
      }
    }
    
    return updatedRequirements;
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await apiClient.login(email, password);
    if (response.success) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async register(userData: any) {
    const response = await apiClient.register(userData);
    if (response.success) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  async logout() {
    const response = await apiClient.logout();
    apiClient.setAuthToken('');
    return response;
  }

  async verifyOTP(email: string, otp: string) {
    const response = await apiClient.verifyOTP(email, otp);
    if (response.success) {
      apiClient.setAuthToken(response.data.token);
    }
    return response;
  }

  // Get service instances for direct access
  getCourseService() { return this.courseService; }
  getNoteService() { return this.noteService; }
  getMaterialService() { return this.materialService; }
  getReminderService() { return this.reminderService; }
  getSemesterService() { return this.semesterService; }
  getTagService() { return this.tagService; }
  getUserPreferencesService() { return this.userPreferencesService; }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
