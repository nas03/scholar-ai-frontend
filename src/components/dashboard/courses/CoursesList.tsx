import { Award, BookOpen, Calendar, Edit, Filter, FolderOpen, Plus, StickyNote } from "lucide-react";
import * as React from 'react';
import { Course } from "../../../types";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Label } from "../../ui/label";
import { Progress } from "../../ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Separator } from "../../ui/separator";
interface CoursesListProps {
  courses: Course[];
  selectedSemester: string;
  onSemesterChange: (semester: string) => void;
  semesters: Array<{ id: string; name: string; startDate: string; endDate: string }>;
  onViewDetails: (courseId: string) => void;
  onEditCourse: (course: Course) => void;
  onAddCourse: () => void;
  onAddSemester: () => void;
  getNotesByCourse: (courseId: string) => any[];
  getMaterialsByCourse: (courseId: string) => any[];
  notes: any[];
  materials: any[];
}

export function CoursesList({
  courses,
  selectedSemester,
  onSemesterChange,
  semesters,
  onViewDetails,
  onEditCourse,
  onAddCourse,
  onAddSemester,
  getNotesByCourse,
  getMaterialsByCourse,
  notes,
  materials
}: CoursesListProps) {
  const filteredCourses = selectedSemester === "all" 
    ? courses 
    : courses.filter(c => c.semester === selectedSemester);

  const calculateSemesterGPA = (semester: string) => {
    const semesterCourses = courses.filter(c => c.semester === semester && c.gpa !== undefined && c.credits);
    if (semesterCourses.length === 0) return 0;
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    semesterCourses.forEach(course => {
      if (course.gpa && course.credits) {
        totalPoints += course.gpa * course.credits;
        totalCredits += course.credits;
      }
    });
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl mb-1">My Courses</h2>
          <p className="text-muted-foreground">
            Organize your courses, materials, and study resources
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onAddSemester}>
            <Calendar className="w-4 h-4 mr-2" />
            Add Semester
          </Button>
          <Button onClick={onAddCourse}>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Semester Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Label>Filter by Semester:</Label>
          </div>
          <Select value={selectedSemester} onValueChange={onSemesterChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map(semester => (
                <SelectItem key={semester.id} value={semester.name}>
                  {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedSemester !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Award className="w-3 h-3" />
              Semester GPA: {calculateSemesterGPA(selectedSemester)}
            </Badge>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
              <p className="text-2xl">{filteredCourses.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lecture Notes</p>
              <p className="text-2xl">{notes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Study Materials</p>
              <p className="text-2xl">{materials.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average GPA</p>
              <p className="text-2xl">
                {selectedSemester === "all" 
                  ? (courses.reduce((acc, c) => acc + (c.gpa || 0), 0) / courses.filter(c => c.gpa).length || 0).toFixed(2)
                  : calculateSemesterGPA(selectedSemester)
                }
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl mb-2">
            {selectedSemester === "all" ? "No courses yet" : `No courses for ${selectedSemester}`}
          </h3>
          <p className="text-muted-foreground mb-6">
            {selectedSemester === "all" 
              ? "Add your first course to start organizing your study materials"
              : "Add a course for this semester or select a different semester"
            }
          </p>
          <Button onClick={onAddCourse}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Course
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseNotesCount = getNotesByCourse(course.id).length;
            const courseMaterialsCount = getMaterialsByCourse(course.id).length;
            
            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 ${course.color}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3>{course.code}</h3>
                        {course.credits && (
                          <Badge variant="outline">{course.credits} cr</Badge>
                        )}
                      </div>
                      <p className="text-sm mb-2">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.instructor}</p>
                    </div>
                  </div>

                  {course.gpa !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">GPA</span>
                        <span className="text-lg">{course.gpa.toFixed(2)}</span>
                      </div>
                      <Progress value={(course.gpa / 4.0) * 100} className="h-2" />
                    </div>
                  )}

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <StickyNote className="w-4 h-4" />
                        Notes
                      </span>
                      <span>{courseNotesCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <FolderOpen className="w-4 h-4" />
                        Materials
                      </span>
                      <span>{courseMaterialsCount}</span>
                    </div>
                    {course.semester && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Semester
                        </span>
                        <span className="text-xs">{course.semester}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => onViewDetails(course.id)}
                    >
                      Open Course
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditCourse(course)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
