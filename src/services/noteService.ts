// Note service for managing note-related operations
import { CreateNoteRequest, Note, UpdateNoteRequest } from '../types';

export class NoteService {
  private notes: Note[] = [];

  constructor(initialNotes: Note[] = []) {
    this.notes = initialNotes;
  }

  // Get all notes
  getAllNotes(): Note[] {
    return [...this.notes];
  }

  // Get note by ID
  getNoteById(id: string): Note | undefined {
    return this.notes.find(note => note.id === id);
  }

  // Get notes by course
  getNotesByCourse(courseId: string): Note[] {
    return this.notes.filter(note => note.courseId === courseId);
  }

  // Get notes by tag
  getNotesByTag(tagName: string): Note[] {
    return this.notes.filter(note => note.tags.includes(tagName));
  }

  // Get notes by multiple tags
  getNotesByTags(tags: string[]): Note[] {
    return this.notes.filter(note => 
      tags.some(tag => note.tags.includes(tag))
    );
  }

  // Add new note
  addNote(noteData: CreateNoteRequest): Note {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
    };
    this.notes.push(newNote);
    return newNote;
  }

  // Update existing note
  updateNote(id: string, noteData: UpdateNoteRequest): Note | null {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return null;

    this.notes[index] = { ...this.notes[index], ...noteData };
    return this.notes[index];
  }

  // Delete note
  deleteNote(id: string): boolean {
    const index = this.notes.findIndex(note => note.id === id);
    if (index === -1) return false;

    this.notes.splice(index, 1);
    return true;
  }

  // Search notes by title or content
  searchNotes(query: string): Note[] {
    const lowercaseQuery = query.toLowerCase();
    return this.notes.filter(note => 
      note.title.toLowerCase().includes(lowercaseQuery) ||
      (note.content && note.content.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get notes by date range
  getNotesByDateRange(startDate: string, endDate: string): Note[] {
    return this.notes.filter(note => 
      note.date >= startDate && note.date <= endDate
    );
  }

  // Get summarized notes
  getSummarizedNotes(): Note[] {
    return this.notes.filter(note => note.summarized);
  }

  // Get non-summarized notes
  getNonSummarizedNotes(): Note[] {
    return this.notes.filter(note => !note.summarized);
  }

  // Set notes (for initialization)
  setNotes(notes: Note[]): void {
    this.notes = [...notes];
  }
}
