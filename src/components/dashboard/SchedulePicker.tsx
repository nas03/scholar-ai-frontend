import { Plus, X } from "lucide-react";
import * as React from 'react';
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
export type ScheduleTime = {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
};

interface SchedulePickerProps {
  value: ScheduleTime[];
  onChange: (schedules: ScheduleTime[]) => void;
}

export function SchedulePicker({ value, onChange }: SchedulePickerProps) {
  const [currentDay, setCurrentDay] = useState("Monday");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleAdd = () => {
    const newSchedule: ScheduleTime = {
      id: Date.now().toString(),
      day: currentDay,
      startTime: startTime,
      endTime: endTime
    };
    onChange([...value, newSchedule]);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter(s => s.id !== id));
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label>Add Class Time</Label>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="space-y-2">
            <Label className="text-xs">Day</Label>
            <Select value={currentDay} onValueChange={setCurrentDay}>
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
            <Label className="text-xs">Start Time</Label>
            <Select value={startTime} onValueChange={setStartTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return [`${hour}:00`, `${hour}:30`];
                }).flat().map(time => (
                  <SelectItem key={time} value={time}>
                    {formatTime(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">End Time</Label>
            <Select value={endTime} onValueChange={setEndTime}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i.toString().padStart(2, '0');
                  return [`${hour}:00`, `${hour}:30`];
                }).flat().map(time => (
                  <SelectItem key={time} value={time}>
                    {formatTime(time)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={handleAdd} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Selected Times</Label>
          <div className="flex flex-wrap gap-2">
            {value.map(schedule => (
              <Badge key={schedule.id} variant="secondary" className="pr-1">
                {schedule.day.slice(0, 3)} {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-2 hover:bg-destructive/20"
                  onClick={() => handleRemove(schedule.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
