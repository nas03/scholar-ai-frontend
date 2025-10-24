// Tag hook for managing tag state and operations
import { useCallback, useState } from 'react';
import { TagService } from '../services';
import { CreateTagRequest, Tag } from '../types';

export function useTags(initialTags: Tag[] = []) {
  const [tagService] = useState(() => new TagService(initialTags));
  const [tags, setTags] = useState<Tag[]>(initialTags);

  const addTag = useCallback((tagData: CreateTagRequest) => {
    const newTag = tagService.addTag(tagData);
    setTags(tagService.getAllTags());
    return newTag;
  }, [tagService]);

  const updateTag = useCallback((id: string, tagData: Partial<Tag>) => {
    const updatedTag = tagService.updateTag(id, tagData);
    if (updatedTag) {
      setTags(tagService.getAllTags());
    }
    return updatedTag;
  }, [tagService]);

  const deleteTag = useCallback((id: string) => {
    const success = tagService.deleteTag(id);
    if (success) {
      setTags(tagService.getAllTags());
    }
    return success;
  }, [tagService]);

  const getTagById = useCallback((id: string) => {
    return tagService.getTagById(id);
  }, [tagService]);

  const getTagByName = useCallback((name: string) => {
    return tagService.getTagByName(name);
  }, [tagService]);

  const getDefaultTags = useCallback(() => {
    return tagService.getDefaultTags();
  }, [tagService]);

  const getCustomTags = useCallback(() => {
    return tagService.getCustomTags();
  }, [tagService]);

  const searchTags = useCallback((query: string) => {
    return tagService.searchTags(query);
  }, [tagService]);

  const getTagsByColor = useCallback((color: string) => {
    return tagService.getTagsByColor(color);
  }, [tagService]);

  const tagExists = useCallback((name: string) => {
    return tagService.tagExists(name);
  }, [tagService]);

  const getMostUsedTags = useCallback((notes: { tags: string[] }[]) => {
    return tagService.getMostUsedTags(notes);
  }, [tagService]);

  return {
    tags,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    getTagByName,
    getDefaultTags,
    getCustomTags,
    searchTags,
    getTagsByColor,
    tagExists,
    getMostUsedTags,
  };
}
