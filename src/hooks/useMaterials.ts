// Material hook for managing course material state and operations
import { useCallback, useState } from 'react';
import { MaterialService } from '../services';
import { CourseMaterial, CreateMaterialRequest, UpdateMaterialRequest } from '../types';

export function useMaterials(initialMaterials: CourseMaterial[] = []) {
  const [materialService] = useState(() => new MaterialService(initialMaterials));
  const [materials, setMaterials] = useState<CourseMaterial[]>(initialMaterials);

  const addMaterial = useCallback((materialData: CreateMaterialRequest) => {
    const newMaterial = materialService.addMaterial(materialData);
    setMaterials(materialService.getAllMaterials());
    return newMaterial;
  }, [materialService]);

  const updateMaterial = useCallback((id: string, materialData: UpdateMaterialRequest) => {
    const updatedMaterial = materialService.updateMaterial(id, materialData);
    if (updatedMaterial) {
      setMaterials(materialService.getAllMaterials());
    }
    return updatedMaterial;
  }, [materialService]);

  const deleteMaterial = useCallback((id: string) => {
    const success = materialService.deleteMaterial(id);
    if (success) {
      setMaterials(materialService.getAllMaterials());
    }
    return success;
  }, [materialService]);

  const getMaterialById = useCallback((id: string) => {
    return materialService.getMaterialById(id);
  }, [materialService]);

  const getMaterialsByCourse = useCallback((courseId: string) => {
    return materialService.getMaterialsByCourse(courseId);
  }, [materialService]);

  const getMaterialsByType = useCallback((type: CourseMaterial['type']) => {
    return materialService.getMaterialsByType(type);
  }, [materialService]);

  const searchMaterials = useCallback((query: string) => {
    return materialService.searchMaterials(query);
  }, [materialService]);

  const getMaterialsByDateRange = useCallback((startDate: string, endDate: string) => {
    return materialService.getMaterialsByDateRange(startDate, endDate);
  }, [materialService]);

  const getRecentMaterials = useCallback((days: number = 7) => {
    return materialService.getRecentMaterials(days);
  }, [materialService]);

  return {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialById,
    getMaterialsByCourse,
    getMaterialsByType,
    searchMaterials,
    getMaterialsByDateRange,
    getRecentMaterials,
  };
}
