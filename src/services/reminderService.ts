// Reminder service for managing reminder operations
import { CreateReminderRequest, Reminder, UpdateReminderRequest } from '../types';

export class ReminderService {
  private reminders: Reminder[] = [];

  constructor(initialReminders: Reminder[] = []) {
    this.reminders = initialReminders;
  }

  // Get all reminders
  getAllReminders(): Reminder[] {
    return [...this.reminders];
  }

  // Get reminder by ID
  getReminderById(id: string): Reminder | undefined {
    return this.reminders.find(reminder => reminder.id === id);
  }

  // Get reminders by course
  getRemindersByCourse(courseId: string): Reminder[] {
    return this.reminders.filter(reminder => reminder.courseId === courseId);
  }

  // Get reminders by type
  getRemindersByType(type: Reminder['type']): Reminder[] {
    return this.reminders.filter(reminder => reminder.type === type);
  }

  // Get reminders by priority
  getRemindersByPriority(priority: Reminder['priority']): Reminder[] {
    return this.reminders.filter(reminder => reminder.priority === priority);
  }

  // Get upcoming reminders (next N days)
  getUpcomingReminders(days: number = 7): Reminder[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + days);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];
    
    return this.reminders.filter(reminder => 
      reminder.dueDate <= cutoffDateString && !reminder.completed
    );
  }

  // Get overdue reminders
  getOverdueReminders(): Reminder[] {
    const today = new Date().toISOString().split('T')[0];
    return this.reminders.filter(reminder => 
      reminder.dueDate < today && !reminder.completed
    );
  }

  // Get completed reminders
  getCompletedReminders(): Reminder[] {
    return this.reminders.filter(reminder => reminder.completed);
  }

  // Get pending reminders
  getPendingReminders(): Reminder[] {
    return this.reminders.filter(reminder => !reminder.completed);
  }

  // Add new reminder
  addReminder(reminderData: CreateReminderRequest): Reminder {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
    };
    this.reminders.push(newReminder);
    return newReminder;
  }

  // Update existing reminder
  updateReminder(id: string, reminderData: UpdateReminderRequest): Reminder | null {
    const index = this.reminders.findIndex(reminder => reminder.id === id);
    if (index === -1) return null;

    this.reminders[index] = { ...this.reminders[index], ...reminderData };
    return this.reminders[index];
  }

  // Delete reminder
  deleteReminder(id: string): boolean {
    const index = this.reminders.findIndex(reminder => reminder.id === id);
    if (index === -1) return false;

    this.reminders.splice(index, 1);
    return true;
  }

  // Mark reminder as completed
  markAsCompleted(id: string): boolean {
    const reminder = this.getReminderById(id);
    if (!reminder) return false;

    return this.updateReminder(id, { completed: true }) !== null;
  }

  // Mark reminder as pending
  markAsPending(id: string): boolean {
    const reminder = this.getReminderById(id);
    if (!reminder) return false;

    return this.updateReminder(id, { completed: false }) !== null;
  }

  // Search reminders by title or description
  searchReminders(query: string): Reminder[] {
    const lowercaseQuery = query.toLowerCase();
    return this.reminders.filter(reminder => 
      reminder.title.toLowerCase().includes(lowercaseQuery) ||
      (reminder.description && reminder.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Set reminders (for initialization)
  setReminders(reminders: Reminder[]): void {
    this.reminders = [...reminders];
  }
}
