import { BookOpen, Calendar, Eye, FileText, Filter, Plus, Search, Sparkles, Tag, Trash2, X } from "lucide-react";
import * as React from 'react';
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { NoteEditor } from "./NoteEditor";
type Note = {
  id: string;
  title: string;
  courseCode: string;
  courseId: string;
  date: string;
  content: string;
  summarized: boolean;
  tags: string[];
};

const DEFAULT_TAGS = [
  "Algorithms", "Data Structures", "Mathematics", "Physics", 
  "Theory", "Practice", "Exam Prep", "Assignment", "Project", "Review"
];

const MOCK_NOTES: Note[] = [
  {
    id: "1",
    title: "Introduction to Algorithms",
    courseCode: "CS101",
    courseId: "1",
    date: "Oct 10, 2025",
    summarized: true,
    tags: ["Algorithms", "Theory"],
    content: `# Introduction to Algorithms

## Overview
Algorithms are step-by-step procedures for solving problems and performing tasks.

### Key Concepts
- **Time Complexity**: How runtime scales with input size
- **Space Complexity**: Memory requirements
- **Big O Notation**: Asymptotic analysis

### Common Algorithm Types
1. **Sorting Algorithms**
   - Bubble Sort: O(n²)
   - Quick Sort: O(n log n)
   - Merge Sort: O(n log n)

2. **Search Algorithms**
   - Linear Search: O(n)
   - Binary Search: O(log n)

### Example: Binary Search
\`\`\`python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
\`\`\`

## Important Notes
> Always consider edge cases and optimize for the expected input size.`
  },
  {
    id: "2",
    title: "Calculus Derivatives",
    courseCode: "MATH201",
    courseId: "2",
    date: "Oct 11, 2025",
    summarized: true,
    tags: ["Mathematics", "Theory", "Calculus"],
    content: `# Calculus: Derivatives

## Definition
The derivative represents the **rate of change** of a function.

### Basic Rules
- **Power Rule**: d/dx(x^n) = nx^(n-1)
- **Product Rule**: d/dx(uv) = u'v + uv'
- **Chain Rule**: d/dx(f(g(x))) = f'(g(x)) · g'(x)

### Common Derivatives
| Function | Derivative |
|----------|-----------|
| x^n      | nx^(n-1)  |
| sin(x)   | cos(x)    |
| cos(x)   | -sin(x)   |
| e^x      | e^x       |
| ln(x)    | 1/x       |

## Example Problem
Find the derivative of f(x) = 3x² + 2x - 5

**Solution:**
f'(x) = 6x + 2`
  },
  {
    id: "3",
    title: "Binary Trees and Graphs",
    courseCode: "CS202",
    courseId: "3",
    date: "Oct 12, 2025",
    summarized: false,
    tags: ["Data Structures", "Algorithms", "Trees"],
    content: `# Binary Trees and Graphs

## Binary Trees
A binary tree is a tree data structure where each node has at most two children.

### Types of Binary Trees
- **Full Binary Tree**: Every node has 0 or 2 children
- **Complete Binary Tree**: All levels filled except possibly the last
- **Binary Search Tree (BST)**: Left subtree < node < right subtree

### Tree Traversal
1. **Inorder**: Left → Root → Right
2. **Preorder**: Root → Left → Right  
3. **Postorder**: Left → Right → Root

## Graphs
A graph consists of vertices (nodes) and edges connecting them.

### Graph Representations
- **Adjacency Matrix**: 2D array
- **Adjacency List**: Array of lists

### Graph Algorithms
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Dijkstra's Algorithm`
  },
  {
    id: "4",
    title: "Newton's Laws of Motion",
    courseCode: "PHY102",
    courseId: "4",
    date: "Oct 12, 2025",
    summarized: true,
    tags: ["Physics", "Theory", "Mechanics"],
    content: `# Newton's Laws of Motion

## First Law (Inertia)
An object at rest stays at rest, and an object in motion stays in motion unless acted upon by a force.

## Second Law (F = ma)
The force on an object equals its mass times acceleration.

**Formula:** F = ma

Where:
- F = Force (Newtons)
- m = Mass (kg)
- a = Acceleration (m/s²)

## Third Law (Action-Reaction)
For every action, there is an equal and opposite reaction.

### Applications
- Rocket propulsion
- Swimming
- Walking`
  }
];

export function LectureNotesPage() {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCourse, setFilterCourse] = useState<string>("all");

  const courses = [
    { id: "1", code: "CS101", name: "Computer Science 101" },
    { id: "2", code: "MATH201", name: "Advanced Mathematics" },
    { id: "3", code: "CS202", name: "Data Structures" },
    { id: "4", code: "PHY102", name: "Physics II" }
  ];

  const handleSaveNote = (noteData: {
    title: string;
    courseId: string;
    courseCode: string;
    content: string;
    tags: string[];
  }) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: noteData.title,
      courseCode: noteData.courseCode,
      courseId: noteData.courseId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      content: noteData.content,
      summarized: false,
      tags: noteData.tags
    };

    setNotes(prev => [newNote, ...prev]);
    setIsEditorOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsViewOpen(false);
    }
  };

  const handleSummarize = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, summarized: true } : note
    ));
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCourse = filterCourse === "all" || note.courseCode === filterCourse;
    return matchesSearch && matchesCourse;
  });

  // Markdown renderer (simple version)
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      // Headers
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl mt-6 mb-3">{line.slice(2)}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl mt-5 mb-2">{line.slice(3)}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg mt-4 mb-2">{line.slice(4)}</h3>;
      
      // Code blocks
      if (line.startsWith('```')) return <div key={i} className="my-2" />;
      
      // Lists
      if (line.match(/^\d+\./)) return <li key={i} className="ml-6 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{line.slice(2)}</li>;
      
      // Bold and italic
      let formattedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
      
      // Blockquote
      if (line.startsWith('>')) {
        return <blockquote key={i} className="border-l-4 border-primary pl-4 my-2 text-muted-foreground" dangerouslySetInnerHTML={{ __html: formattedLine.slice(1) }} />;
      }
      
      // Table rows
      if (line.includes('|')) {
        const cells = line.split('|').filter(c => c.trim());
        return (
          <tr key={i}>
            {cells.map((cell, j) => (
              <td key={j} className="border border-border px-3 py-2">{cell.trim()}</td>
            ))}
          </tr>
        );
      }
      
      return line ? <p key={i} className="my-2" dangerouslySetInnerHTML={{ __html: formattedLine }} /> : <br key={i} />;
    });
  };

  // Show editor in full screen
  if (isEditorOpen) {
    return (
      <NoteEditor 
        onBack={() => setIsEditorOpen(false)}
        onSave={handleSaveNote}
        courses={courses}
        defaultTags={DEFAULT_TAGS}
      />
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl mb-1">Lecture Notes</h2>
          <p className="text-muted-foreground">
            Organize notes with tags for automatic knowledge mapping
          </p>
        </div>
        <Button onClick={() => setIsEditorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Note
        </Button>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Notes</p>
              <p className="text-xl">{notes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Summarized</p>
              <p className="text-xl">{notes.filter(n => n.summarized).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 md:col-span-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search notes or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCourse} onValueChange={setFilterCourse}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.code}>{course.code}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.map((note) => (
          <Card key={note.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <h3 className="mb-1">{note.title}</h3>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <Badge variant="secondary">{note.courseCode}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {note.date}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Tag className="w-3 h-3" />
                        {note.tags.length} tags
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {note.summarized && (
                    <Badge className="bg-green-500 flex-shrink-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Summarized
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedNote(note);
                      setIsViewOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  {!note.summarized && (
                    <Button 
                      size="sm"
                      onClick={() => handleSummarize(note.id)}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Summarize
                    </Button>
                  )}
                  <Button 
                    size="sm"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredNotes.length === 0 && (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No notes found</p>
          </Card>
        )}
      </div>

      {/* View Note Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle>{selectedNote?.title}</DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{selectedNote?.courseCode}</Badge>
                  <span className="text-sm text-muted-foreground">{selectedNote?.date}</span>
                  {selectedNote?.summarized && (
                    <Badge className="bg-green-500">
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Summarized
                    </Badge>
                  )}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setIsViewOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>

          <Separator />

          <div className="flex items-center gap-2 flex-wrap py-2">
            {selectedNote?.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <Separator />

          <div className="flex-1 overflow-y-auto py-4">
            <div className="prose prose-sm max-w-none">
              {selectedNote && renderMarkdown(selectedNote.content)}
            </div>
          </div>

          <Separator />

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => {
              if (selectedNote && !selectedNote.summarized) {
                handleSummarize(selectedNote.id);
              }
            }}>
              <Sparkles className="w-4 h-4 mr-2" />
              {selectedNote?.summarized ? 'Re-summarize' : 'Summarize'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
