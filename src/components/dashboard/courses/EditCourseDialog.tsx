import { Trash2 } from "lucide-react";
import * as React from 'react';
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Separator } from "../../ui/separator";
import { Textarea } from "../../ui/textarea";
import { SchedulePicker, ScheduleTime } from "../SchedulePicker";
import { colorOptions } from "./utils";
interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
  onCourseChange: (course: any) => void;
  onSubmit: () => void;
  onDelete: () => void;
  semesters: Array<{ id: string; name: string; startDate: string; endDate: string }>;
}

export function EditCourseDialog({
  open,
  onOpenChange,
  course,
  onCourseChange,
  onSubmit,
  onDelete,
  semesters
}: EditCourseDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update course information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code">Course Code</Label>
              <Input
                id="edit-code"
                value={course.code}
                onChange={(e) => onCourseChange({ ...course, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-credits">Credits</Label>
              <Input
                id="edit-credits"
                type="number"
                value={course.credits}
                onChange={(e) => onCourseChange({ ...course, credits: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-name">Course Name</Label>
            <Input
              id="edit-name"
              value={course.name}
              onChange={(e) => onCourseChange({ ...course, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-semester">Semester</Label>
            <Select value={course.semester} onValueChange={(value) => onCourseChange({ ...course, semester: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {semesters.map(semester => (
                  <SelectItem key={semester.id} value={semester.name}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-instructor">Instructor</Label>
            <Input
              id="edit-instructor"
              value={course.instructor}
              onChange={(e) => onCourseChange({ ...course, instructor: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={course.location || ""}
              onChange={(e) => onCourseChange({ ...course, location: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <SchedulePicker
              value={course.scheduleDetails || []}
              onChange={(value) => onCourseChange({ ...course, scheduleDetails: value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-gpa">Current GPA (0.0 - 4.0)</Label>
            <Input
              id="edit-gpa"
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={course.gpa}
              onChange={(e) => onCourseChange({ ...course, gpa: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-color">Color Theme</Label>
            <Select value={course.color} onValueChange={(value) => onCourseChange({ ...course, color: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colorOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded ${option.value}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={course.description || ""}
              onChange={(e) => onCourseChange({ ...course, description: e.target.value })}
              rows={3}
            />
          </div>

          <Separator />

          <Button 
            variant="destructive"
            className="w-full"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Course
          </Button>
        </div>

        <Button onClick={onSubmit} className="w-full">
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
