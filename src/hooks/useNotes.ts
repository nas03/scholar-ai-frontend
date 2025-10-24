// Note hook for managing note state and operations
import { useCallback, useState } from 'react';
import { NoteService } from '../services';
import { CreateNoteRequest, Note, UpdateNoteRequest } from '../types';

export function useNotes(initialNotes: Note[] = []) {
  const [noteService] = useState(() => new NoteService(initialNotes));
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote = useCallback((noteData: CreateNoteRequest) => {
    const newNote = noteService.addNote(noteData);
    setNotes(noteService.getAllNotes());
    return newNote;
  }, [noteService]);

  const updateNote = useCallback((id: string, noteData: UpdateNoteRequest) => {
    const updatedNote = noteService.updateNote(id, noteData);
    if (updatedNote) {
      setNotes(noteService.getAllNotes());
    }
    return updatedNote;
  }, [noteService]);

  const deleteNote = useCallback((id: string) => {
    const success = noteService.deleteNote(id);
    if (success) {
      setNotes(noteService.getAllNotes());
    }
    return success;
  }, [noteService]);

  const getNoteById = useCallback((id: string) => {
    return noteService.getNoteById(id);
  }, [noteService]);

  const getNotesByCourse = useCallback((courseId: string) => {
    return noteService.getNotesByCourse(courseId);
  }, [noteService]);

  const getNotesByTag = useCallback((tagName: string) => {
    return noteService.getNotesByTag(tagName);
  }, [noteService]);

  const getNotesByTags = useCallback((tags: string[]) => {
    return noteService.getNotesByTags(tags);
  }, [noteService]);

  const searchNotes = useCallback((query: string) => {
    return noteService.searchNotes(query);
  }, [noteService]);

  const getNotesByDateRange = useCallback((startDate: string, endDate: string) => {
    return noteService.getNotesByDateRange(startDate, endDate);
  }, [noteService]);

  const getSummarizedNotes = useCallback(() => {
    return noteService.getSummarizedNotes();
  }, [noteService]);

  const getNonSummarizedNotes = useCallback(() => {
    return noteService.getNonSummarizedNotes();
  }, [noteService]);

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    getNotesByCourse,
    getNotesByTag,
    getNotesByTags,
    searchNotes,
    getNotesByDateRange,
    getSummarizedNotes,
    getNonSummarizedNotes,
  };
}
