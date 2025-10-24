import * as React from 'react';
import { useState } from "react";
import { useData } from "../../contexts/DataContext";
import { ScheduleTime } from "./SchedulePicker";
import { AddCourseDialog } from "./courses/AddCourseDialog";
import { AddMaterialDialog } from "./courses/AddMaterialDialog";
import { AddNoteDialog } from "./courses/AddNoteDialog";
import { AddSemesterDialog } from "./courses/AddSemesterDialog";
import { CourseDetails } from "./courses/CourseDetails";
import { CoursesList } from "./courses/CoursesList";
import { EditCourseDialog } from "./courses/EditCourseDialog";
import { generateScheduleString } from "./courses/utils";
export function CoursesPage() {
  const { 
    courses, 
    notes, 
    materials, 
    semesters, 
    addCourse, 
    updateCourse, 
    deleteCourse, 
    addNote, 
    addMaterial, 
    deleteMaterial, 
    addSemester, 
    getNotesByCourse, 
    getMaterialsByCourse 
  } = useData();
  
  const [view, setView] = useState<"list" | "details">("list");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [showEditCourseDialog, setShowEditCourseDialog] = useState(false);
  const [showAddMaterialDialog, setShowAddMaterialDialog] = useState(false);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [showAddSemesterDialog, setShowAddSemesterDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);

  const [addCourseForm, setAddCourseForm] = useState({
    name: "",
    code: "",
    instructor: "",
    scheduleDetails: [] as ScheduleTime[],
    location: "",
    description: "",
    color: "bg-blue-500",
    credits: "",
    semester: "",
    gpa: ""
  });

  const [addMaterialForm, setAddMaterialForm] = useState({
    title: "",
    type: "pdf" as "video" | "pdf" | "text" | "link" | "other",
    url: "",
    description: "",
    size: ""
  });

  const [addNoteForm, setAddNoteForm] = useState({
    title: "",
    tags: [] as string[],
    pages: ""
  });

  const [addSemesterForm, setAddSemesterForm] = useState({
    name: "",
    startDate: "",
    endDate: ""
  });

  const activeCourse = activeCourseId ? courses.find(c => c.id === activeCourseId) : null;
  const courseNotes = activeCourseId ? getNotesByCourse(activeCourseId) : [];
  const courseMaterials = activeCourseId ? getMaterialsByCourse(activeCourseId) : [];

  const handleAddCourse = () => {
    const scheduleString = generateScheduleString(addCourseForm.scheduleDetails);
    
    addCourse({
      ...addCourseForm,
      schedule: scheduleString,
      scheduleDetails: addCourseForm.scheduleDetails,
      credits: addCourseForm.credits ? parseInt(addCourseForm.credits) : undefined,
      gpa: addCourseForm.gpa ? parseFloat(addCourseForm.gpa) : undefined,
      students: 0,
      progress: 0
    });
    setShowAddCourseDialog(false);
    setAddCourseForm({
      name: "",
      code: "",
      instructor: "",
      scheduleDetails: [],
      location: "",
      description: "",
      color: "bg-blue-500",
      credits: "",
      semester: "",
      gpa: ""
    });
  };

  const handleEditCourse = () => {
    if (editingCourse) {
      const scheduleString = generateScheduleString(editingCourse.scheduleDetails || []);
      
      updateCourse(editingCourse.id, {
        name: editingCourse.name,
        code: editingCourse.code,
        instructor: editingCourse.instructor,
        schedule: scheduleString,
        scheduleDetails: editingCourse.scheduleDetails,
        location: editingCourse.location,
        description: editingCourse.description,
        color: editingCourse.color,
        credits: editingCourse.credits ? parseInt(editingCourse.credits) : undefined,
        semester: editingCourse.semester,
        gpa: editingCourse.gpa ? parseFloat(editingCourse.gpa) : undefined
      });
      setShowEditCourseDialog(false);
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = () => {
    if (editingCourse && confirm("Are you sure you want to delete this course? All associated notes and materials will remain but won't be linked to this course.")) {
      deleteCourse(editingCourse.id);
      if (activeCourseId === editingCourse.id) {
        setView("list");
        setActiveCourseId(null);
      }
      setShowEditCourseDialog(false);
      setEditingCourse(null);
    }
  };

  const handleAddMaterial = () => {
    if (activeCourseId) {
      addMaterial({
        courseId: activeCourseId,
        ...addMaterialForm,
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      setShowAddMaterialDialog(false);
      setAddMaterialForm({
        title: "",
        type: "pdf",
        url: "",
        description: "",
        size: ""
      });
    }
  };

  const handleAddNote = () => {
    if (activeCourseId && activeCourse) {
      addNote({
        title: addNoteForm.title,
        courseId: activeCourseId,
        courseCode: activeCourse.code,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        pages: addNoteForm.pages ? parseInt(addNoteForm.pages) : 1,
        summarized: false,
        tags: addNoteForm.tags
      });
      setShowAddNoteDialog(false);
      setAddNoteForm({
        title: "",
        tags: [],
        pages: ""
      });
    }
  };

  const handleAddSemester = () => {
    addSemester(addSemesterForm);
    setShowAddSemesterDialog(false);
    setAddSemesterForm({
      name: "",
      startDate: "",
      endDate: ""
    });
  };

  const handleViewDetails = (courseId: string) => {
    setActiveCourseId(courseId);
    setView("details");
  };

  const handleBackToList = () => {
    setView("list");
    setActiveCourseId(null);
  };

  const handleEditCourseClick = (course: any) => {
    setEditingCourse({ 
      ...course, 
      credits: course.credits?.toString() || "", 
      gpa: course.gpa?.toString() || "",
      scheduleDetails: course.scheduleDetails || []
    });
    setShowEditCourseDialog(true);
  };

  // List View
  if (view === "list") {
    return (
      <>
        <CoursesList
          courses={courses}
          selectedSemester={selectedSemester}
          onSemesterChange={setSelectedSemester}
          semesters={semesters}
          onViewDetails={handleViewDetails}
          onEditCourse={handleEditCourseClick}
          onAddCourse={() => setShowAddCourseDialog(true)}
          onAddSemester={() => setShowAddSemesterDialog(true)}
          getNotesByCourse={getNotesByCourse}
          getMaterialsByCourse={getMaterialsByCourse}
          notes={notes}
          materials={materials}
        />

        <AddCourseDialog
          open={showAddCourseDialog}
          onOpenChange={setShowAddCourseDialog}
          formData={addCourseForm}
          onFormChange={setAddCourseForm}
          onSubmit={handleAddCourse}
          semesters={semesters}
        />

        <EditCourseDialog
          open={showEditCourseDialog}
          onOpenChange={setShowEditCourseDialog}
          course={editingCourse}
          onCourseChange={setEditingCourse}
          onSubmit={handleEditCourse}
          onDelete={handleDeleteCourse}
          semesters={semesters}
        />

        <AddSemesterDialog
          open={showAddSemesterDialog}
          onOpenChange={setShowAddSemesterDialog}
          formData={addSemesterForm}
          onFormChange={setAddSemesterForm}
          onSubmit={handleAddSemester}
        />
      </>
    );
  }

  // Details View
  if (view === "details" && activeCourse) {
    return (
      <>
        <CourseDetails
          course={activeCourse}
          courseNotes={courseNotes}
          courseMaterials={courseMaterials}
          onBack={handleBackToList}
          onEditCourse={handleEditCourseClick}
          onAddMaterial={() => setShowAddMaterialDialog(true)}
          onAddNote={() => setShowAddNoteDialog(true)}
          onDeleteMaterial={deleteMaterial}
        />

        <EditCourseDialog
          open={showEditCourseDialog}
          onOpenChange={setShowEditCourseDialog}
          course={editingCourse}
          onCourseChange={setEditingCourse}
          onSubmit={handleEditCourse}
          onDelete={handleDeleteCourse}
          semesters={semesters}
        />

        <AddMaterialDialog
          open={showAddMaterialDialog}
          onOpenChange={setShowAddMaterialDialog}
          formData={addMaterialForm}
          onFormChange={setAddMaterialForm}
          onSubmit={handleAddMaterial}
        />

        <AddNoteDialog
          open={showAddNoteDialog}
          onOpenChange={setShowAddNoteDialog}
          courseCode={activeCourse.code}
          formData={addNoteForm}
          onFormChange={setAddNoteForm}
          onSubmit={handleAddNote}
        />
      </>
    );
  }

  return null;
}
