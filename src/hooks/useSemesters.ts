// Semester hook for managing semester state and operations
import { useCallback, useState } from 'react';
import { SemesterService } from '../services';
import { CreateSemesterRequest, Semester, UpdateSemesterRequest } from '../types';

export function useSemesters(initialSemesters: Semester[] = []) {
  const [semesterService] = useState(() => new SemesterService(initialSemesters));
  const [semesters, setSemesters] = useState<Semester[]>(initialSemesters);

  const addSemester = useCallback((semesterData: CreateSemesterRequest) => {
    const newSemester = semesterService.addSemester(semesterData);
    setSemesters(semesterService.getAllSemesters());
    return newSemester;
  }, [semesterService]);

  const updateSemester = useCallback((id: string, semesterData: UpdateSemesterRequest) => {
    const updatedSemester = semesterService.updateSemester(id, semesterData);
    if (updatedSemester) {
      setSemesters(semesterService.getAllSemesters());
    }
    return updatedSemester;
  }, [semesterService]);

  const deleteSemester = useCallback((id: string) => {
    const success = semesterService.deleteSemester(id);
    if (success) {
      setSemesters(semesterService.getAllSemesters());
    }
    return success;
  }, [semesterService]);

  const getSemesterById = useCallback((id: string) => {
    return semesterService.getSemesterById(id);
  }, [semesterService]);

  const getCurrentSemester = useCallback(() => {
    return semesterService.getCurrentSemester();
  }, [semesterService]);

  const getUpcomingSemesters = useCallback(() => {
    return semesterService.getUpcomingSemesters();
  }, [semesterService]);

  const getPastSemesters = useCallback(() => {
    return semesterService.getPastSemesters();
  }, [semesterService]);

  const getSortedSemesters = useCallback(() => {
    return semesterService.getSortedSemesters();
  }, [semesterService]);

  const getSemestersByYear = useCallback((year: number) => {
    return semesterService.getSemestersByYear(year);
  }, [semesterService]);

  return {
    semesters,
    addSemester,
    updateSemester,
    deleteSemester,
    getSemesterById,
    getCurrentSemester,
    getUpcomingSemesters,
    getPastSemesters,
    getSortedSemesters,
    getSemestersByYear,
  };
}
