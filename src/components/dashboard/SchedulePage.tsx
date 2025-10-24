import { BookOpen, Calendar, Clock, Edit2, MapPin, Plus, Trash2, X } from "lucide-react";
import * as React from 'react';
import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
type ScheduleEvent = {
  id: string;
  time: string;
  course: string;
  courseCode?: string;
  title: string;
  location: string;
  type: 'class' | 'study' | 'exam' | 'meeting';
  description?: string;
  color?: string;
};

type ScheduleData = {
  [key: string]: ScheduleEvent[];
};

export function SchedulePage() {
  const { courses } = useData();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [events, setEvents] = useState<ScheduleData>({});

  // Get current day
  const getCurrentDay = () => {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Map to our days array (Monday first)
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return dayNames[dayIndex];
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('en-US', options);
  };

  const [currentDay] = useState(getCurrentDay());
  const [currentDate] = useState(getCurrentDate());

  const [formData, setFormData] = useState({
    day: currentDay,
    time: "",
    course: "",
    title: "",
    location: "",
    type: "class" as 'class' | 'study' | 'exam' | 'meeting',
    description: ""
  });

  // Sync course schedules with the schedule page
  useEffect(() => {
    const scheduleData: ScheduleData = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    courses.forEach(course => {
      if (course.scheduleDetails && course.scheduleDetails.length > 0) {
        course.scheduleDetails.forEach(schedule => {
          const event: ScheduleEvent = {
            id: `course-${course.id}-${schedule.id}`,
            time: formatTime(schedule.startTime),
            course: course.code,
            courseCode: course.code,
            title: course.name,
            location: course.location || "TBA",
            type: 'class',
            color: course.color
          };
          scheduleData[schedule.day].push(event);
        });
      }
    });

    // Sort events by time for each day
    Object.keys(scheduleData).forEach(day => {
      scheduleData[day].sort((a, b) => {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return timeA.localeCompare(timeB);
      });
    });

    setEvents(scheduleData);
  }, [courses]);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (time: string) => {
    const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return time;
    
    let [, hours, minutes, period] = match;
    let hour = parseInt(hours);
    
    if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
    
    return `${hour.toString().padStart(2, '0')}:${minutes}`;
  };

  const getCourseColor = (course: string, type: string, color?: string) => {
    if (color) return color;
    if (type === 'study') return 'bg-cyan-500';
    if (type === 'exam') return 'bg-red-500';
    if (type === 'meeting') return 'bg-yellow-500';
    
    // Find course in courses list
    const foundCourse = courses.find(c => c.code === course);
    return foundCourse?.color || "bg-gray-500";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'study':
        return <BookOpen className="w-4 h-4" />;
      case 'exam':
        return <Edit2 className="w-4 h-4" />;
      case 'meeting':
        return <Calendar className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleAddEvent = () => {
    if (!formData.time || !formData.title || !formData.location) return;

    const newEvent: ScheduleEvent = {
      id: `custom-${Date.now()}`,
      time: formData.time,
      course: formData.course,
      courseCode: formData.course,
      title: formData.title,
      location: formData.location,
      type: formData.type,
      description: formData.description
    };

    setEvents(prev => ({
      ...prev,
      [formData.day]: [...(prev[formData.day] || []), newEvent].sort((a, b) => {
        const timeA = convertTo24Hour(a.time);
        const timeB = convertTo24Hour(b.time);
        return timeA.localeCompare(timeB);
      })
    }));

    // Reset form
    setFormData({
      day: currentDay,
      time: "",
      course: "",
      title: "",
      location: "",
      type: "class",
      description: ""
    });
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = (day: string, eventId: string) => {
    // Only allow deletion of custom events (not course-based events)
    if (eventId.startsWith('course-')) {
      alert('Cannot delete course-based events. Edit the course schedule in the Courses section instead.');
      return;
    }

    setEvents(prev => ({
      ...prev,
      [day]: prev[day].filter(event => event.id !== eventId)
    }));
  };

  const todayEvents = events[currentDay] || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl mb-1">Schedule</h2>
          <p className="text-muted-foreground">
            Your weekly class schedule and events
          </p>
        </div>
        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={formData.day} onValueChange={(value) => setFormData(prev => ({ ...prev, day: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map(day => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time"
                  value={formData.time}
                  onChange={(e) => {
                    const time24 = e.target.value;
                    const [hours, minutes] = time24.split(':');
                    const formatted = formatTime(`${hours}:${minutes}`);
                    setFormData(prev => ({ ...prev, time: formatted }));
                  }}
                  placeholder="Select time"
                />
              </div>
              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="study">Study Session</SelectItem>
                    <SelectItem value="exam">Exam/Test</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Course Code (Optional)</Label>
                <Input 
                  value={formData.course}
                  onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input 
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Event title"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input 
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Room or location"
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Additional details..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEvent}>
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-xl">
                {Object.values(events).reduce((sum, day) => sum + day.length, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Classes This Week</p>
              <p className="text-xl">
                {Object.values(events).reduce((sum, day) => sum + day.filter(e => e.type === 'class').length, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Exams</p>
              <p className="text-xl">
                {Object.values(events).reduce((sum, day) => sum + day.filter(e => e.type === 'exam').length, 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Current Day Highlight */}
      <Card className="p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3>Today's Schedule</h3>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>
        </div>
        <div className="space-y-3">
          {todayEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No events scheduled for today
            </div>
          ) : (
            todayEvents.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-muted rounded-lg group">
                <div className="w-20 text-center flex-shrink-0">
                  <div className="w-10 h-10 mx-auto mb-1 rounded-lg bg-background flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <p className="text-sm">{item.time}</p>
                </div>
                <div className={`w-1 h-12 rounded ${getCourseColor(item.course, item.type, item.color)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.courseCode && <Badge variant="secondary">{item.courseCode}</Badge>}
                    <Badge variant="outline" className="capitalize">{item.type}</Badge>
                    <h4 className="truncate">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <p>{item.location}</p>
                  </div>
                </div>
                {!item.id.startsWith('course-') && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleDeleteEvent(currentDay, item.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Weekly Schedule */}
      <div>
        <h3 className="mb-4">Weekly Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {days.filter(d => d !== 'Saturday' && d !== 'Sunday').map((day) => (
            <Card key={day} className={`p-4 ${day === currentDay ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                <h4 className="text-center flex-1">{day}</h4>
                <Badge variant="secondary" className="text-xs">
                  {events[day]?.length || 0}
                </Badge>
              </div>
              <div className="space-y-2">
                {events[day]?.length > 0 ? (
                  events[day].map((item) => (
                    <div 
                      key={item.id} 
                      className={`p-2 rounded-lg text-white group relative ${getCourseColor(item.course, item.type, item.color)}`}
                    >
                      <p className="text-xs mb-1 opacity-90">{item.time}</p>
                      <p className="text-sm mb-1 truncate">{item.courseCode || item.title}</p>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 opacity-75" />
                        <p className="text-xs opacity-75 truncate">{item.location}</p>
                      </div>
                      {!item.id.startsWith('course-') && (
                        <button
                          onClick={() => handleDeleteEvent(day, item.id)}
                          className="absolute top-1 right-1 w-5 h-5 rounded bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No events
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
