import { AlertCircle, Bell, CheckCircle2, Clock, Edit, Plus, Trash2 } from "lucide-react";
import * as React from 'react';
import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
export function StudyRemindersPage() {
  const { reminders, courses, addReminder, updateReminder, deleteReminder } = useData();
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const [addReminderForm, setAddReminderForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    courseId: "",
    priority: "medium" as "low" | "medium" | "high",
    type: "assignment" as "assignment" | "exam" | "reading" | "project" | "other"
  });

  const handleAddReminder = () => {
    const selectedCourse = courses.find(c => c.id === addReminderForm.courseId);
    
    addReminder({
      ...addReminderForm,
      courseCode: selectedCourse?.code,
      completed: false
    });
    
    setShowAddReminderDialog(false);
    setAddReminderForm({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      courseId: "",
      priority: "medium",
      type: "assignment"
    });
  };

  const handleToggleComplete = (reminderId: string, currentStatus: boolean) => {
    updateReminder(reminderId, { completed: !currentStatus });
  };

  const handleDeleteReminder = (reminderId: string) => {
    if (confirm("Delete this reminder?")) {
      deleteReminder(reminderId);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-orange-500";
      case "low":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "exam":
        return "📝";
      case "assignment":
        return "📋";
      case "reading":
        return "📚";
      case "project":
        return "🚀";
      default:
        return "📌";
    }
  };

  // Sort reminders by date and priority
  const sortedReminders = [...reminders].sort((a, b) => {
    const dateA = new Date(a.dueDate + ' ' + a.dueTime);
    const dateB = new Date(b.dueDate + ' ' + b.dueTime);
    return dateA.getTime() - dateB.getTime();
  });

  const upcomingReminders = sortedReminders.filter(r => !r.completed);
  const completedReminders = sortedReminders.filter(r => r.completed);

  const totalPages = Math.ceil(upcomingReminders.length / ITEMS_PER_PAGE);
  const currentReminders = upcomingReminders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl mb-1">Study Reminders</h2>
          <p className="text-muted-foreground">
            Stay on track with assignments, exams, and study sessions
          </p>
        </div>
        <Button onClick={() => setShowAddReminderDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming</p>
              <p className="text-2xl mt-1">{upcomingReminders.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl mt-1">{completedReminders.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Priority</p>
              <p className="text-2xl mt-1">
                {upcomingReminders.filter(r => r.priority === "high").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Reminders */}
      <div className="mb-6">
        <h3 className="mb-4">Upcoming Reminders</h3>
        {upcomingReminders.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h4 className="mb-2">No upcoming reminders</h4>
            <p className="text-sm text-muted-foreground mb-6">
              Add reminders for assignments, exams, and study sessions
            </p>
            <Button onClick={() => setShowAddReminderDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Reminder
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {currentReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(reminder.priority)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getTypeIcon(reminder.type)}</span>
                          <h4>{reminder.title}</h4>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mb-2">{reminder.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {reminder.courseCode && (
                            <Badge variant="secondary">{reminder.courseCode}</Badge>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{reminder.dueDate} at {reminder.dueTime}</span>
                          </div>
                          <Badge 
                            className={getPriorityColor(reminder.priority)}
                          >
                            {reminder.priority}
                          </Badge>
                          <Badge variant="outline">
                            {reminder.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleComplete(reminder.id, reminder.completed)}
                          title="Mark as complete"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          title="Delete reminder"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Completed ({completedReminders.length})</h3>
            <div className="flex items-center gap-2">
              <Label htmlFor="show-completed" className="text-sm cursor-pointer">
                Show completed
              </Label>
              <Switch 
                id="show-completed"
                checked={showCompleted} 
                onCheckedChange={setShowCompleted}
              />
            </div>
          </div>
          {showCompleted && (
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
              <Card key={reminder.id} className="p-4 opacity-60">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{getTypeIcon(reminder.type)}</span>
                          <h4 className="line-through">{reminder.title}</h4>
                        </div>
                        {reminder.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-through">{reminder.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                          {reminder.courseCode && (
                            <Badge variant="secondary">{reminder.courseCode}</Badge>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{reminder.dueDate} at {reminder.dueTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleComplete(reminder.id, reminder.completed)}
                          title="Mark as incomplete"
                        >
                          <CheckCircle2 className="w-5 h-5 fill-current" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteReminder(reminder.id)}
                          title="Delete reminder"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Reminder Dialog */}
      <Dialog open={showAddReminderDialog} onOpenChange={setShowAddReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription>
              Create a reminder for assignments, exams, or study sessions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-title">Title *</Label>
              <Input
                id="reminder-title"
                placeholder="e.g., CS101 Assignment 3"
                value={addReminderForm.title}
                onChange={(e) => setAddReminderForm({ ...addReminderForm, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-description">Description</Label>
              <Textarea
                id="reminder-description"
                placeholder="Additional details about this reminder"
                value={addReminderForm.description}
                onChange={(e) => setAddReminderForm({ ...addReminderForm, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-course">Course</Label>
              <Select value={addReminderForm.courseId} onValueChange={(value) => setAddReminderForm({ ...addReminderForm, courseId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-date">Due Date *</Label>
                <Input
                  id="reminder-date"
                  type="date"
                  value={addReminderForm.dueDate}
                  onChange={(e) => setAddReminderForm({ ...addReminderForm, dueDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-time">Due Time *</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={addReminderForm.dueTime}
                  onChange={(e) => setAddReminderForm({ ...addReminderForm, dueTime: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-type">Type *</Label>
              <Select value={addReminderForm.type} onValueChange={(value: any) => setAddReminderForm({ ...addReminderForm, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assignment">📋 Assignment</SelectItem>
                  <SelectItem value="exam">📝 Exam</SelectItem>
                  <SelectItem value="reading">📚 Reading</SelectItem>
                  <SelectItem value="project">🚀 Project</SelectItem>
                  <SelectItem value="other">📌 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder-priority">Priority *</Label>
              <Select value={addReminderForm.priority} onValueChange={(value: any) => setAddReminderForm({ ...addReminderForm, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High Priority</SelectItem>
                  <SelectItem value="medium">🟠 Medium Priority</SelectItem>
                  <SelectItem value="low">🔵 Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleAddReminder} 
            disabled={!addReminderForm.title || !addReminderForm.dueDate || !addReminderForm.dueTime}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Reminder
          </Button>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.max(prev - 1, 1));
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(index + 1);
                  }}
                  isActive={currentPage === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}