// Reminder hook for managing reminder state and operations
import { useCallback, useState } from 'react';
import { ReminderService } from '../services';
import { CreateReminderRequest, Reminder, UpdateReminderRequest } from '../types';

export function useReminders(initialReminders: Reminder[] = []) {
  const [reminderService] = useState(() => new ReminderService(initialReminders));
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const addReminder = useCallback((reminderData: CreateReminderRequest) => {
    const newReminder = reminderService.addReminder(reminderData);
    setReminders(reminderService.getAllReminders());
    return newReminder;
  }, [reminderService]);

  const updateReminder = useCallback((id: string, reminderData: UpdateReminderRequest) => {
    const updatedReminder = reminderService.updateReminder(id, reminderData);
    if (updatedReminder) {
      setReminders(reminderService.getAllReminders());
    }
    return updatedReminder;
  }, [reminderService]);

  const deleteReminder = useCallback((id: string) => {
    const success = reminderService.deleteReminder(id);
    if (success) {
      setReminders(reminderService.getAllReminders());
    }
    return success;
  }, [reminderService]);

  const getReminderById = useCallback((id: string) => {
    return reminderService.getReminderById(id);
  }, [reminderService]);

  const getRemindersByCourse = useCallback((courseId: string) => {
    return reminderService.getRemindersByCourse(courseId);
  }, [reminderService]);

  const getRemindersByType = useCallback((type: Reminder['type']) => {
    return reminderService.getRemindersByType(type);
  }, [reminderService]);

  const getRemindersByPriority = useCallback((priority: Reminder['priority']) => {
    return reminderService.getRemindersByPriority(priority);
  }, [reminderService]);

  const getUpcomingReminders = useCallback((days: number = 7) => {
    return reminderService.getUpcomingReminders(days);
  }, [reminderService]);

  const getOverdueReminders = useCallback(() => {
    return reminderService.getOverdueReminders();
  }, [reminderService]);

  const getCompletedReminders = useCallback(() => {
    return reminderService.getCompletedReminders();
  }, [reminderService]);

  const getPendingReminders = useCallback(() => {
    return reminderService.getPendingReminders();
  }, [reminderService]);

  const markAsCompleted = useCallback((id: string) => {
    const success = reminderService.markAsCompleted(id);
    if (success) {
      setReminders(reminderService.getAllReminders());
    }
    return success;
  }, [reminderService]);

  const markAsPending = useCallback((id: string) => {
    const success = reminderService.markAsPending(id);
    if (success) {
      setReminders(reminderService.getAllReminders());
    }
    return success;
  }, [reminderService]);

  const searchReminders = useCallback((query: string) => {
    return reminderService.searchReminders(query);
  }, [reminderService]);

  return {
    reminders,
    addReminder,
    updateReminder,
    deleteReminder,
    getReminderById,
    getRemindersByCourse,
    getRemindersByType,
    getRemindersByPriority,
    getUpcomingReminders,
    getOverdueReminders,
    getCompletedReminders,
    getPendingReminders,
    markAsCompleted,
    markAsPending,
    searchReminders,
  };
}
