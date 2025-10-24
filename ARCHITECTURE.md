bun # Scholar AI Frontend - Refactored Architecture

This document describes the refactored architecture of the Scholar AI frontend application, which has been modularized for better maintainability, testability, and scalability.

## Architecture Overview

The application has been refactored from a monolithic `DataContext.tsx` file into a modular structure with clear separation of concerns:

```
src/
├── types/           # Type definitions
├── services/        # Business logic layer
├── hooks/           # React hooks for state management
├── api/             # API client and service layer
├── data/            # Mock data and initial state
└── contexts/        # React context providers
```

## Directory Structure

### `/types`
Contains all TypeScript type definitions:
- **`index.ts`** - Main types file with all data models and API types
- Core types: `Course`, `Note`, `CourseMaterial`, `Reminder`, `Semester`, `Tag`, `UserPreferences`, `GraduationRequirements`
- API types: `ApiResponse`, `PaginatedResponse`, request/response types

### `/services`
Business logic layer with service classes:
- **`courseService.ts`** - Course management operations
- **`noteService.ts`** - Note management operations  
- **`materialService.ts`** - Course material operations
- **`reminderService.ts`** - Reminder management
- **`semesterService.ts`** - Semester operations
- **`tagService.ts`** - Tag management
- **`userPreferencesService.ts`** - User settings and preferences
- **`index.ts`** - Service exports

Each service provides:
- CRUD operations
- Business logic methods
- Data filtering and searching
- Calculation methods (GPA, progress, etc.)

### `/hooks`
React hooks for state management:
- **`useCourses.ts`** - Course state and operations
- **`useNotes.ts`** - Note state and operations
- **`useMaterials.ts`** - Material state and operations
- **`useReminders.ts`** - Reminder state and operations
- **`useSemesters.ts`** - Semester state and operations
- **`useTags.ts`** - Tag state and operations
- **`useUserPreferences.ts`** - User preferences state
- **`index.ts`** - Hook exports

Each hook:
- Manages local state using `useState`
- Provides service instances
- Exposes service methods as callbacks
- Handles state updates automatically

### `/api`
API layer for backend integration:
- **`client.ts`** - HTTP client with authentication
- **`service.ts`** - API service with offline/online sync
- **`index.ts`** - API exports

Features:
- RESTful API client
- Authentication token management
- Offline/online synchronization
- Error handling
- Request/response typing

### `/data`
Mock data and initial state:
- **`mockData.ts`** - Initial data for development
- Contains sample courses, notes, materials, etc.
- Used for testing and development

### `/contexts`
React context providers:
- **`DataContext.tsx`** - Main data context (refactored)
- Combines all hooks into a single context
- Maintains backward compatibility
- Provides unified API for components

## Key Benefits

### 1. **Separation of Concerns**
- Types are centralized and reusable
- Business logic is isolated in services
- State management is handled by hooks
- API communication is abstracted

### 2. **Testability**
- Services can be unit tested independently
- Hooks can be tested with React Testing Library
- Mock data is easily replaceable
- API layer can be mocked

### 3. **Maintainability**
- Each domain has its own files
- Clear interfaces and contracts
- Easy to locate and modify specific functionality
- Reduced coupling between components

### 4. **Scalability**
- Easy to add new features
- Services can be extended independently
- API layer supports future backend integration
- Hooks can be composed for complex state

### 5. **Developer Experience**
- Better IntelliSense and type safety
- Clear file organization
- Reusable components and logic
- Consistent patterns across the codebase

## Usage Examples

### Using Individual Hooks
```typescript
import { useCourses } from '../hooks';

function CourseComponent() {
  const { courses, addCourse, updateCourse } = useCourses();
  
  const handleAddCourse = () => {
    addCourse({
      name: "New Course",
      code: "CS101",
      // ... other fields
    });
  };
  
  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>{course.name}</div>
      ))}
    </div>
  );
}
```

### Using Services Directly
```typescript
import { CourseService } from '../services';

const courseService = new CourseService();
const courses = courseService.getAllCourses();
const gpa = courseService.calculateOverallGPA();
```

### Using API Layer
```typescript
import { apiService } from '../api';

// Automatically syncs with backend when online
const courses = await apiService.getCourses();
const newCourse = await apiService.createCourse(courseData);
```

## Migration Guide

### For Components
1. Import types from `../types` instead of `../contexts/DataContext`
2. Continue using `useData()` hook from context (backward compatible)
3. Optionally migrate to individual hooks for better performance

### For New Features
1. Define types in `/types/index.ts`
2. Create service class in `/services/`
3. Create hook in `/hooks/`
4. Add API methods in `/api/` if needed
5. Update context if necessary

## Future Enhancements

1. **State Management**: Consider Redux Toolkit for complex state
2. **Caching**: Implement React Query for API caching
3. **Real-time**: Add WebSocket support for live updates
4. **Testing**: Add comprehensive test suites
5. **Performance**: Implement virtualization for large lists
6. **PWA**: Add offline-first capabilities

## Backward Compatibility

The refactored `DataContext` maintains full backward compatibility with existing components. All existing `useData()` calls will continue to work without modification.

## Contributing

When adding new features:
1. Follow the established patterns
2. Add types first
3. Implement service layer
4. Create hooks
5. Update context if needed
6. Add tests
7. Update documentation
