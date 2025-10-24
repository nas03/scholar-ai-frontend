// Tag service for managing tag operations
import { CreateTagRequest, Tag } from '../types';

export class TagService {
  private tags: Tag[] = [];

  constructor(initialTags: Tag[] = []) {
    this.tags = initialTags;
  }

  // Get all tags
  getAllTags(): Tag[] {
    return [...this.tags];
  }

  // Get tag by ID
  getTagById(id: string): Tag | undefined {
    return this.tags.find(tag => tag.id === id);
  }

  // Get tag by name
  getTagByName(name: string): Tag | undefined {
    return this.tags.find(tag => tag.name.toLowerCase() === name.toLowerCase());
  }

  // Get default tags
  getDefaultTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'default');
  }

  // Get custom tags
  getCustomTags(): Tag[] {
    return this.tags.filter(tag => tag.type === 'custom');
  }

  // Add new tag
  addTag(tagData: CreateTagRequest): Tag {
    const newTag: Tag = {
      ...tagData,
      id: Date.now().toString(),
    };
    this.tags.push(newTag);
    return newTag;
  }

  // Update existing tag
  updateTag(id: string, tagData: Partial<Tag>): Tag | null {
    const index = this.tags.findIndex(tag => tag.id === id);
    if (index === -1) return null;

    this.tags[index] = { ...this.tags[index], ...tagData };
    return this.tags[index];
  }

  // Delete tag
  deleteTag(id: string): boolean {
    const index = this.tags.findIndex(tag => tag.id === id);
    if (index === -1) return false;

    this.tags.splice(index, 1);
    return true;
  }

  // Search tags by name
  searchTags(query: string): Tag[] {
    const lowercaseQuery = query.toLowerCase();
    return this.tags.filter(tag => 
      tag.name.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get tags by color
  getTagsByColor(color: string): Tag[] {
    return this.tags.filter(tag => tag.color === color);
  }

  // Check if tag exists
  tagExists(name: string): boolean {
    return this.tags.some(tag => tag.name.toLowerCase() === name.toLowerCase());
  }

  // Get most used tags (would need note data to calculate)
  getMostUsedTags(notes: { tags: string[] }[]): Tag[] {
    const tagCounts = new Map<string, number>();
    
    notes.forEach(note => {
      note.tags.forEach(tagName => {
        tagCounts.set(tagName, (tagCounts.get(tagName) || 0) + 1);
      });
    });

    return this.tags
      .filter(tag => tagCounts.has(tag.name))
      .sort((a, b) => (tagCounts.get(b.name) || 0) - (tagCounts.get(a.name) || 0));
  }

  // Set tags (for initialization)
  setTags(tags: Tag[]): void {
    this.tags = [...tags];
  }
}
