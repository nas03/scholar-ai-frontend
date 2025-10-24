// API client for backend communication
import {
    ApiResponse,
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
    PaginatedResponse,
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

class ApiClient {
  private baseUrl: string;
  private token?: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge additional headers if provided
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Course API methods
  async getCourses(): Promise<ApiResponse<Course[]>> {
    return this.request<Course[]>('/courses');
  }

  async getCourse(id: string): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${id}`);
  }

  async createCourse(course: CreateCourseRequest): Promise<ApiResponse<Course>> {
    return this.request<Course>('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  async updateCourse(id: string, course: UpdateCourseRequest): Promise<ApiResponse<Course>> {
    return this.request<Course>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course),
    });
  }

  async deleteCourse(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Note API methods
  async getNotes(): Promise<ApiResponse<Note[]>> {
    return this.request<Note[]>('/notes');
  }

  async getNote(id: string): Promise<ApiResponse<Note>> {
    return this.request<Note>(`/notes/${id}`);
  }

  async getNotesByCourse(courseId: string): Promise<ApiResponse<Note[]>> {
    return this.request<Note[]>(`/courses/${courseId}/notes`);
  }

  async createNote(note: CreateNoteRequest): Promise<ApiResponse<Note>> {
    return this.request<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
  }

  async updateNote(id: string, note: UpdateNoteRequest): Promise<ApiResponse<Note>> {
    return this.request<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(note),
    });
  }

  async deleteNote(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  }

  // Material API methods
  async getMaterials(): Promise<ApiResponse<CourseMaterial[]>> {
    return this.request<CourseMaterial[]>('/materials');
  }

  async getMaterial(id: string): Promise<ApiResponse<CourseMaterial>> {
    return this.request<CourseMaterial>(`/materials/${id}`);
  }

  async getMaterialsByCourse(courseId: string): Promise<ApiResponse<CourseMaterial[]>> {
    return this.request<CourseMaterial[]>(`/courses/${courseId}/materials`);
  }

  async createMaterial(material: CreateMaterialRequest): Promise<ApiResponse<CourseMaterial>> {
    return this.request<CourseMaterial>('/materials', {
      method: 'POST',
      body: JSON.stringify(material),
    });
  }

  async updateMaterial(id: string, material: UpdateMaterialRequest): Promise<ApiResponse<CourseMaterial>> {
    return this.request<CourseMaterial>(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(material),
    });
  }

  async deleteMaterial(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/materials/${id}`, {
      method: 'DELETE',
    });
  }

  // Reminder API methods
  async getReminders(): Promise<ApiResponse<Reminder[]>> {
    return this.request<Reminder[]>('/reminders');
  }

  async getReminder(id: string): Promise<ApiResponse<Reminder>> {
    return this.request<Reminder>(`/reminders/${id}`);
  }

  async getRemindersByCourse(courseId: string): Promise<ApiResponse<Reminder[]>> {
    return this.request<Reminder[]>(`/courses/${courseId}/reminders`);
  }

  async createReminder(reminder: CreateReminderRequest): Promise<ApiResponse<Reminder>> {
    return this.request<Reminder>('/reminders', {
      method: 'POST',
      body: JSON.stringify(reminder),
    });
  }

  async updateReminder(id: string, reminder: UpdateReminderRequest): Promise<ApiResponse<Reminder>> {
    return this.request<Reminder>(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reminder),
    });
  }

  async deleteReminder(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/reminders/${id}`, {
      method: 'DELETE',
    });
  }

  // Semester API methods
  async getSemesters(): Promise<ApiResponse<Semester[]>> {
    return this.request<Semester[]>('/semesters');
  }

  async getSemester(id: string): Promise<ApiResponse<Semester>> {
    return this.request<Semester>(`/semesters/${id}`);
  }

  async createSemester(semester: CreateSemesterRequest): Promise<ApiResponse<Semester>> {
    return this.request<Semester>('/semesters', {
      method: 'POST',
      body: JSON.stringify(semester),
    });
  }

  async updateSemester(id: string, semester: UpdateSemesterRequest): Promise<ApiResponse<Semester>> {
    return this.request<Semester>(`/semesters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(semester),
    });
  }

  async deleteSemester(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/semesters/${id}`, {
      method: 'DELETE',
    });
  }

  // Tag API methods
  async getTags(): Promise<ApiResponse<Tag[]>> {
    return this.request<Tag[]>('/tags');
  }

  async getTag(id: string): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${id}`);
  }

  async createTag(tag: CreateTagRequest): Promise<ApiResponse<Tag>> {
    return this.request<Tag>('/tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    });
  }

  async updateTag(id: string, tag: Partial<Tag>): Promise<ApiResponse<Tag>> {
    return this.request<Tag>(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tag),
    });
  }

  async deleteTag(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/tags/${id}`, {
      method: 'DELETE',
    });
  }

  // User preferences API methods
  async getUserPreferences(): Promise<ApiResponse<UserPreferences>> {
    return this.request<UserPreferences>('/user/preferences');
  }

  async updateUserPreferences(preferences: UpdateUserPreferencesRequest): Promise<ApiResponse<UserPreferences>> {
    return this.request<UserPreferences>('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  async getGraduationRequirements(): Promise<ApiResponse<GraduationRequirements>> {
    return this.request<GraduationRequirements>('/user/graduation-requirements');
  }

  async updateGraduationRequirements(requirements: UpdateGraduationRequirementsRequest): Promise<ApiResponse<GraduationRequirements>> {
    return this.request<GraduationRequirements>('/user/graduation-requirements', {
      method: 'PUT',
      body: JSON.stringify(requirements),
    });
  }

  // Auth API methods
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async verifyOTP(email: string, otp: string): Promise<ApiResponse<{ token: string; user: any }>> {
    return this.request<{ token: string; user: any }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
