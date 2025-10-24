// Material service for managing course material operations
import { CourseMaterial, CreateMaterialRequest, UpdateMaterialRequest } from '../types';

export class MaterialService {
  private materials: CourseMaterial[] = [];

  constructor(initialMaterials: CourseMaterial[] = []) {
    this.materials = initialMaterials;
  }

  // Get all materials
  getAllMaterials(): CourseMaterial[] {
    return [...this.materials];
  }

  // Get material by ID
  getMaterialById(id: string): CourseMaterial | undefined {
    return this.materials.find(material => material.id === id);
  }

  // Get materials by course
  getMaterialsByCourse(courseId: string): CourseMaterial[] {
    return this.materials.filter(material => material.courseId === courseId);
  }

  // Get materials by type
  getMaterialsByType(type: CourseMaterial['type']): CourseMaterial[] {
    return this.materials.filter(material => material.type === type);
  }

  // Add new material
  addMaterial(materialData: CreateMaterialRequest): CourseMaterial {
    const newMaterial: CourseMaterial = {
      ...materialData,
      id: Date.now().toString(),
    };
    this.materials.push(newMaterial);
    return newMaterial;
  }

  // Update existing material
  updateMaterial(id: string, materialData: UpdateMaterialRequest): CourseMaterial | null {
    const index = this.materials.findIndex(material => material.id === id);
    if (index === -1) return null;

    this.materials[index] = { ...this.materials[index], ...materialData };
    return this.materials[index];
  }

  // Delete material
  deleteMaterial(id: string): boolean {
    const index = this.materials.findIndex(material => material.id === id);
    if (index === -1) return false;

    this.materials.splice(index, 1);
    return true;
  }

  // Search materials by title or description
  searchMaterials(query: string): CourseMaterial[] {
    const lowercaseQuery = query.toLowerCase();
    return this.materials.filter(material => 
      material.title.toLowerCase().includes(lowercaseQuery) ||
      (material.description && material.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Get materials by upload date range
  getMaterialsByDateRange(startDate: string, endDate: string): CourseMaterial[] {
    return this.materials.filter(material => 
      material.uploadDate >= startDate && material.uploadDate <= endDate
    );
  }

  // Get recent materials (last N days)
  getRecentMaterials(days: number = 7): CourseMaterial[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];
    
    return this.materials.filter(material => 
      material.uploadDate >= cutoffDateString
    );
  }

  // Set materials (for initialization)
  setMaterials(materials: CourseMaterial[]): void {
    this.materials = [...materials];
  }
}
