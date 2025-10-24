// Core data types for the Scholar AI application

export type ScheduleTime = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

export type Course = {
  id: string;
  name: string;
  code: string;
  instructor: string;
  students: number;
  schedule: string; // Legacy field for display
  scheduleDetails?: ScheduleTime[]; // New structured schedule
  location?: string;
  color: string;
  progress: number;
  description?: string;
  credits?: number;
  semester?: string;
  gpa?: number;
};

export type Note = {
  id: string;
  title: string;
  courseId: string;
  courseCode: string;
  date: string;
  pages: number;
  summarized: boolean;
  tags: string[];
  content?: string;
};

export type CourseMaterial = {
  id: string;
  courseId: string;
  title: string;
  type: 'video' | 'pdf' | 'text' | 'link' | 'other';
  url?: string;
  uploadDate: string;
  size?: string;
  description?: string;
};

export type Tag = {
  id: string;
  name: string;
  type: 'default' | 'custom';
  color: string;
};

export type KnowledgeConnection = {
  from: Note;
  to: Note;
  sharedTags: string[];
  strength: number;
};

export type Semester = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

export type Reminder = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  dueTime: string;
  courseId?: string;
  courseCode?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  type: 'assignment' | 'exam' | 'reading' | 'project' | 'other';
};

export type GraduationRequirements = {
  requiredCredits: number;
  currentCredits: number;
};

export type UserPreferences = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    studentId?: string;
    major?: string;
    profilePicture?: string;
  };
  academic: {
    gpaScale: '4.0' | '5.0' | '10.0';
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
  };
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

// Request types for API calls
export type CreateCourseRequest = Omit<Course, 'id'>;
export type UpdateCourseRequest = Partial<Course>;
export type CreateNoteRequest = Omit<Note, 'id'>;
export type UpdateNoteRequest = Partial<Note>;
export type CreateMaterialRequest = Omit<CourseMaterial, 'id'>;
export type UpdateMaterialRequest = Partial<CourseMaterial>;
export type CreateSemesterRequest = Omit<Semester, 'id'>;
export type UpdateSemesterRequest = Partial<Semester>;
export type CreateReminderRequest = Omit<Reminder, 'id'>;
export type UpdateReminderRequest = Partial<Reminder>;
export type CreateTagRequest = Omit<Tag, 'id'>;
export type UpdateUserPreferencesRequest = Partial<UserPreferences>;
export type UpdateGraduationRequirementsRequest = Partial<GraduationRequirements>;
