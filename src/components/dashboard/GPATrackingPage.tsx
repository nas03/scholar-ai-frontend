import { Award, BarChart3, Plus, Settings, TrendingUp } from "lucide-react";
import * as React from 'react';
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useData } from "../../contexts/DataContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
export function GPATrackingPage() {
  const { courses, semesters, graduationRequirements, updateGraduationRequirements } = useData();
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [requiredCreditsInput, setRequiredCreditsInput] = useState(graduationRequirements.requiredCredits.toString());

  // Calculate total credits from courses
  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);

  // Group courses by semester and calculate semester GPAs
  const semesterData = semesters.map(semester => {
    const semesterCourses = courses.filter(c => c.semester === semester.name);
    const coursesWithGPA = semesterCourses.filter(c => c.gpa !== undefined && c.credits);
    
    let totalPoints = 0;
    let totalSemesterCredits = 0;
    
    coursesWithGPA.forEach(course => {
      if (course.gpa && course.credits) {
        totalPoints += course.gpa * course.credits;
        totalSemesterCredits += course.credits;
      }
    });
    
    const semesterGPA = totalSemesterCredits > 0 ? totalPoints / totalSemesterCredits : 0;
    
    return {
      semester: semester.name,
      gpa: parseFloat(semesterGPA.toFixed(2)),
      credits: totalSemesterCredits
    };
  }).filter(s => s.credits > 0); // Only show semesters with courses

  // Calculate cumulative GPA
  let cumulativeTotalPoints = 0;
  let cumulativeTotalCredits = 0;
  
  courses.forEach(course => {
    if (course.gpa !== undefined && course.credits) {
      cumulativeTotalPoints += course.gpa * course.credits;
      cumulativeTotalCredits += course.credits;
    }
  });
  
  const cumulativeGPA = cumulativeTotalCredits > 0 ? cumulativeTotalPoints / cumulativeTotalCredits : 0;

  // Get current semester (last semester with courses)
  const currentSemester = semesterData.length > 0 ? semesterData[semesterData.length - 1] : null;
  const currentSemesterGPA = currentSemester?.gpa || 0;

  // Get courses from current semester
  const currentSemesterName = currentSemester?.semester || "";
  const currentCourses = courses.filter(c => c.semester === currentSemesterName);

  // Grade color and badge mapping
  const getGradeColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600';
    if (gpa >= 3.0) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeVariant = (gpa: number): "default" | "secondary" | "destructive" | "outline" => {
    if (gpa >= 3.7) return 'default';
    if (gpa >= 3.0) return 'secondary';
    return 'outline';
  };

  const getLetterGrade = (gpa: number): string => {
    if (gpa >= 4.0) return 'A';
    if (gpa >= 3.7) return 'A-';
    if (gpa >= 3.3) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'B-';
    if (gpa >= 2.3) return 'C+';
    if (gpa >= 2.0) return 'C';
    if (gpa >= 1.7) return 'C-';
    if (gpa >= 1.3) return 'D+';
    if (gpa >= 1.0) return 'D';
    return 'F';
  };

  const handleSaveSettings = () => {
    updateGraduationRequirements({
      requiredCredits: parseInt(requiredCreditsInput) || 120
    });
    setShowSettingsDialog(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl mb-1">GPA Tracking</h2>
          <p className="text-muted-foreground">
            Monitor your academic performance and progress
          </p>
        </div>
        <Button variant="outline" onClick={() => setShowSettingsDialog(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Current GPA Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Cumulative GPA</p>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl mb-1">{cumulativeGPA.toFixed(2)}</p>
          {semesterData.length > 1 && (
            <p className={`text-sm ${
              semesterData[semesterData.length - 1].gpa >= semesterData[semesterData.length - 2].gpa 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {semesterData[semesterData.length - 1].gpa >= semesterData[semesterData.length - 2].gpa ? '+' : ''}
              {(semesterData[semesterData.length - 1].gpa - semesterData[semesterData.length - 2].gpa).toFixed(2)} from last semester
            </p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Current Semester</p>
            {currentSemester && <Badge>In Progress</Badge>}
          </div>
          <p className="text-3xl mb-1">{currentSemesterGPA.toFixed(2)}</p>
          {currentSemester && (
            <p className="text-sm text-muted-foreground">{currentSemester.credits} credits</p>
          )}
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <Award className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl mb-1">{totalCredits}</p>
          <p className="text-sm text-muted-foreground">of {graduationRequirements.requiredCredits} required</p>
          <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${Math.min((totalCredits / graduationRequirements.requiredCredits) * 100, 100)}%` }}
            />
          </div>
        </Card>
      </div>

      {/* GPA Trend Chart */}
      {semesterData.length > 0 && (
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">GPA Trend Over Time</h3>
              <p className="text-sm text-muted-foreground">Your academic performance across semesters</p>
            </div>
            {semesterData.length > 1 && (
              <Badge variant="outline" className={`${
                semesterData[semesterData.length - 1].gpa >= semesterData[0].gpa 
                  ? 'text-green-600 border-green-600' 
                  : 'text-red-600 border-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 mr-1" />
                {semesterData[semesterData.length - 1].gpa >= semesterData[0].gpa ? 'Trending Up' : 'Trending Down'}
              </Badge>
            )}
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={semesterData}>
              <defs>
                <linearGradient id="gpaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="semester" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0, 4.0]}
                ticks={[0, 1.0, 2.0, 3.0, 4.0]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  padding: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}
                formatter={(value: number) => [value.toFixed(2), 'GPA']}
              />
              <Area 
                type="monotone" 
                dataKey="gpa" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fill="url(#gpaGradient)"
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* GPA Statistics */}
          {semesterData.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Highest GPA</p>
                <p className="text-xl">{Math.max(...semesterData.map(h => h.gpa)).toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Lowest GPA</p>
                <p className="text-xl">{Math.min(...semesterData.map(h => h.gpa)).toFixed(2)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Average GPA</p>
                <p className="text-xl">
                  {(semesterData.reduce((sum, h) => sum + h.gpa, 0) / semesterData.length).toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Semester History Table */}
      {semesterData.length > 0 && (
        <Card className="p-6 mb-6">
          <h3 className="mb-4">Semester History</h3>
          <div className="space-y-2">
            {semesterData.map((semester, index) => {
              const isCurrent = index === semesterData.length - 1;
              return (
                <div 
                  key={semester.semester} 
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    isCurrent ? 'bg-primary/5 border border-primary/20' : 'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-primary text-primary-foreground' : 'bg-background'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p>{semester.semester}</p>
                        {isCurrent && <Badge>Current</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{semester.credits} credits</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl">{semester.gpa.toFixed(2)}</p>
                    {index > 0 && (
                      <p className={`text-sm ${
                        semester.gpa >= semesterData[index - 1].gpa ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {semester.gpa >= semesterData[index - 1].gpa ? '+' : ''}
                        {(semester.gpa - semesterData[index - 1].gpa).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Current Courses */}
      {currentCourses.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Current Semester Breakdown</h3>
            <Badge variant="secondary">{currentCourses.length} Courses</Badge>
          </div>
          <div className="space-y-3">
            {currentCourses.map((course) => (
              <div key={course.code} className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg ${course.color} flex items-center justify-center`}>
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="mb-1">{course.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{course.code}</Badge>
                      <p className="text-sm text-muted-foreground">{course.credits} credits</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {course.gpa !== undefined ? (
                    <>
                      <Badge variant={getGradeBadgeVariant(course.gpa)} className="mb-2">
                        {getLetterGrade(course.gpa)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{course.gpa.toFixed(1)} GPA</p>
                    </>
                  ) : (
                    <Badge variant="outline">No Grade</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          {currentSemester && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Semester GPA</p>
                <p className="text-xs text-muted-foreground">Based on current grades</p>
              </div>
              <p className="text-2xl">{currentSemesterGPA.toFixed(2)}</p>
            </div>
          )}
        </Card>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <Card className="p-12 text-center">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl mb-2">No courses yet</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Add courses in the Courses section to start tracking your GPA
          </p>
        </Card>
      )}

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>GPA Tracking Settings</DialogTitle>
            <DialogDescription>
              Configure your graduation requirements
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="required-credits">Required Credits for Graduation</Label>
              <Input
                id="required-credits"
                type="number"
                placeholder="e.g., 120"
                value={requiredCreditsInput}
                onChange={(e) => setRequiredCreditsInput(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Total credits needed to graduate from your program
              </p>
            </div>

            <div className="space-y-2">
              <Label>Current Progress</Label>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Credits Completed</span>
                  <span className="text-lg">{totalCredits}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Credits Remaining</span>
                  <span className="text-lg">
                    {Math.max((parseInt(requiredCreditsInput) || 120) - totalCredits, 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-lg">
                    {Math.min((totalCredits / (parseInt(requiredCreditsInput) || 120)) * 100, 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="w-full">
            Save Settings
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
