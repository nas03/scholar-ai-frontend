import React, { createContext, ReactNode, useContext } from "react";
import {
    defaultTags,
    initialCourses,
    initialGraduationRequirements,
    initialMaterials,
    initialNotes,
    initialReminders,
    initialSemesters,
    initialUserPreferences
} from "../data/mockData";
import {
    useCourses,
    useMaterials,
    useNotes,
    useReminders,
    useSemesters,
    useTags,
    useUserPreferences
} from "../hooks";
import {
    Course,
    CourseMaterial,
    GraduationRequirements,
    Note,
    Reminder,
    Semester,
    Tag,
    UserPreferences
} from "../types";

interface DataContextType {
  // Data
  courses: Course[];
  notes: Note[];
  tags: Tag[];
  materials: CourseMaterial[];
  semesters: Semester[];
  reminders: Reminder[];
  graduationRequirements: GraduationRequirements;
  userPreferences: UserPreferences;
  
  // Course operations
  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, course: Partial<Course>) => Course | null;
  deleteCourse: (id: string) => boolean;
  getCourseById: (id: string) => Course | undefined;
  getCoursesBySemester: (semester: string) => Course[];
  calculateSemesterGPA: (semester: string) => number;
  calculateOverallGPA: () => number;
  getTotalCredits: () => number;
  
  // Note operations
  addNote: (note: Omit<Note, 'id'>) => Note;
  updateNote: (id: string, note: Partial<Note>) => Note | null;
  deleteNote: (id: string) => boolean;
  getNotesByCourse: (courseId: string) => Note[];
  getNotesByTag: (tagName: string) => Note[];
  getNotesByTags: (tags: string[]) => Note[];
  searchNotes: (query: string) => Note[];
  getNotesByDateRange: (startDate: string, endDate: string) => Note[];
  getSummarizedNotes: () => Note[];
  getNonSummarizedNotes: () => Note[];
  
  // Material operations
  addMaterial: (material: Omit<CourseMaterial, 'id'>) => CourseMaterial;
  updateMaterial: (id: string, material: Partial<CourseMaterial>) => CourseMaterial | null;
  deleteMaterial: (id: string) => boolean;
  getMaterialsByCourse: (courseId: string) => CourseMaterial[];
  getMaterialsByType: (type: CourseMaterial['type']) => CourseMaterial[];
  searchMaterials: (query: string) => CourseMaterial[];
  getMaterialsByDateRange: (startDate: string, endDate: string) => CourseMaterial[];
  getRecentMaterials: (days?: number) => CourseMaterial[];
  
  // Reminder operations
  addReminder: (reminder: Omit<Reminder, 'id'>) => Reminder;
  updateReminder: (id: string, reminder: Partial<Reminder>) => Reminder | null;
  deleteReminder: (id: string) => boolean;
  getRemindersByCourse: (courseId: string) => Reminder[];
  getRemindersByType: (type: Reminder['type']) => Reminder[];
  getRemindersByPriority: (priority: Reminder['priority']) => Reminder[];
  getUpcomingReminders: (days?: number) => Reminder[];
  getOverdueReminders: () => Reminder[];
  getCompletedReminders: () => Reminder[];
  getPendingReminders: () => Reminder[];
  markAsCompleted: (id: string) => boolean;
  markAsPending: (id: string) => boolean;
  searchReminders: (query: string) => Reminder[];
  
  // Semester operations
  addSemester: (semester: Omit<Semester, 'id'>) => Semester;
  updateSemester: (id: string, semester: Partial<Semester>) => Semester | null;
  deleteSemester: (id: string) => boolean;
  getCurrentSemester: () => Semester | undefined;
  getUpcomingSemesters: () => Semester[];
  getPastSemesters: () => Semester[];
  getSortedSemesters: () => Semester[];
  getSemestersByYear: (year: number) => Semester[];
  
  // Tag operations
  addTag: (tag: Omit<Tag, 'id'>) => Tag;
  updateTag: (id: string, tag: Partial<Tag>) => Tag | null;
  deleteTag: (id: string) => boolean;
  getTagById: (id: string) => Tag | undefined;
  getTagByName: (name: string) => Tag | undefined;
  getDefaultTags: () => Tag[];
  getCustomTags: () => Tag[];
  searchTags: (query: string) => Tag[];
  getTagsByColor: (color: string) => Tag[];
  tagExists: (name: string) => boolean;
  getMostUsedTags: (notes: { tags: string[] }[]) => Tag[];
  
  // User preferences operations
  updateUserPreferences: (preferences: Partial<UserPreferences>) => UserPreferences;
  updateGraduationRequirements: (requirements: Partial<GraduationRequirements>) => GraduationRequirements;
  updatePersonalInfo: (personalInfo: Partial<UserPreferences['personalInfo']>) => UserPreferences['personalInfo'];
  updateAcademicSettings: (academic: Partial<UserPreferences['academic']>) => UserPreferences['academic'];
  updateAppearanceSettings: (appearance: Partial<UserPreferences['appearance']>) => UserPreferences['appearance'];
  calculateGraduationProgress: (currentCredits: number) => number;
  isGraduationRequirementsMet: (currentCredits: number) => boolean;
  getRemainingCredits: (currentCredits: number) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  // Initialize all hooks with mock data
  const coursesHook = useCourses(initialCourses);
  const notesHook = useNotes(initialNotes);
  const materialsHook = useMaterials(initialMaterials);
  const remindersHook = useReminders(initialReminders);
  const semestersHook = useSemesters(initialSemesters);
  const tagsHook = useTags(defaultTags);
  const userPreferencesHook = useUserPreferences(initialUserPreferences, initialGraduationRequirements);

  const contextValue: DataContextType = {
    // Data
    courses: coursesHook.courses,
    notes: notesHook.notes,
    tags: tagsHook.tags,
    materials: materialsHook.materials,
    semesters: semestersHook.semesters,
    reminders: remindersHook.reminders,
    graduationRequirements: userPreferencesHook.graduationRequirements,
    userPreferences: userPreferencesHook.userPreferences,
    
    // Course operations
    addCourse: coursesHook.addCourse,
    updateCourse: coursesHook.updateCourse,
    deleteCourse: coursesHook.deleteCourse,
    getCourseById: coursesHook.getCourseById,
    getCoursesBySemester: coursesHook.getCoursesBySemester,
    calculateSemesterGPA: coursesHook.calculateSemesterGPA,
    calculateOverallGPA: coursesHook.calculateOverallGPA,
    getTotalCredits: coursesHook.getTotalCredits,
    
    // Note operations
    addNote: notesHook.addNote,
    updateNote: notesHook.updateNote,
    deleteNote: notesHook.deleteNote,
    getNotesByCourse: notesHook.getNotesByCourse,
    getNotesByTag: notesHook.getNotesByTag,
    getNotesByTags: notesHook.getNotesByTags,
    searchNotes: notesHook.searchNotes,
    getNotesByDateRange: notesHook.getNotesByDateRange,
    getSummarizedNotes: notesHook.getSummarizedNotes,
    getNonSummarizedNotes: notesHook.getNonSummarizedNotes,
    
    // Material operations
    addMaterial: materialsHook.addMaterial,
    updateMaterial: materialsHook.updateMaterial,
    deleteMaterial: materialsHook.deleteMaterial,
    getMaterialsByCourse: materialsHook.getMaterialsByCourse,
    getMaterialsByType: materialsHook.getMaterialsByType,
    searchMaterials: materialsHook.searchMaterials,
    getMaterialsByDateRange: materialsHook.getMaterialsByDateRange,
    getRecentMaterials: materialsHook.getRecentMaterials,
    
    // Reminder operations
    addReminder: remindersHook.addReminder,
    updateReminder: remindersHook.updateReminder,
    deleteReminder: remindersHook.deleteReminder,
    getRemindersByCourse: remindersHook.getRemindersByCourse,
    getRemindersByType: remindersHook.getRemindersByType,
    getRemindersByPriority: remindersHook.getRemindersByPriority,
    getUpcomingReminders: remindersHook.getUpcomingReminders,
    getOverdueReminders: remindersHook.getOverdueReminders,
    getCompletedReminders: remindersHook.getCompletedReminders,
    getPendingReminders: remindersHook.getPendingReminders,
    markAsCompleted: remindersHook.markAsCompleted,
    markAsPending: remindersHook.markAsPending,
    searchReminders: remindersHook.searchReminders,
    
    // Semester operations
    addSemester: semestersHook.addSemester,
    updateSemester: semestersHook.updateSemester,
    deleteSemester: semestersHook.deleteSemester,
    getCurrentSemester: semestersHook.getCurrentSemester,
    getUpcomingSemesters: semestersHook.getUpcomingSemesters,
    getPastSemesters: semestersHook.getPastSemesters,
    getSortedSemesters: semestersHook.getSortedSemesters,
    getSemestersByYear: semestersHook.getSemestersByYear,
    
    // Tag operations
    addTag: tagsHook.addTag,
    updateTag: tagsHook.updateTag,
    deleteTag: tagsHook.deleteTag,
    getTagById: tagsHook.getTagById,
    getTagByName: tagsHook.getTagByName,
    getDefaultTags: tagsHook.getDefaultTags,
    getCustomTags: tagsHook.getCustomTags,
    searchTags: tagsHook.searchTags,
    getTagsByColor: tagsHook.getTagsByColor,
    tagExists: tagsHook.tagExists,
    getMostUsedTags: tagsHook.getMostUsedTags,
    
    // User preferences operations
    updateUserPreferences: userPreferencesHook.updateUserPreferences,
    updateGraduationRequirements: userPreferencesHook.updateGraduationRequirements,
    updatePersonalInfo: userPreferencesHook.updatePersonalInfo,
    updateAcademicSettings: userPreferencesHook.updateAcademicSettings,
    updateAppearanceSettings: userPreferencesHook.updateAppearanceSettings,
    calculateGraduationProgress: userPreferencesHook.calculateGraduationProgress,
    isGraduationRequirementsMet: userPreferencesHook.isGraduationRequirementsMet,
    getRemainingCredits: userPreferencesHook.getRemainingCredits,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}