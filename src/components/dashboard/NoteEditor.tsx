import {
  ArrowLeft,
  Edit3,
  Eye,
  Highlighter,
  MessageSquare,
  Plus,
  Save,
  Trash2,
  X
} from "lucide-react";
import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
type Highlight = {
  id: string;
  text: string;
  color: string;
  startIndex: number;
  endIndex: number;
};

type Comment = {
  id: string;
  text: string;
  content: string;
  position: { x: number; y: number };
  startIndex: number;
  endIndex: number;
};

type NoteEditorProps = {
  onBack: () => void;
  onSave: (note: {
    title: string;
    courseId: string;
    courseCode: string;
    content: string;
    tags: string[];
  }) => void;
  courses: Array<{ id: string; code: string; name: string }>;
  defaultTags: string[];
};

const HIGHLIGHT_COLORS = [
  { name: "Yellow", value: "bg-yellow-200 dark:bg-yellow-900/30" },
  { name: "Green", value: "bg-green-200 dark:bg-green-900/30" },
  { name: "Blue", value: "bg-blue-200 dark:bg-blue-900/30" },
  { name: "Pink", value: "bg-pink-200 dark:bg-pink-900/30" },
  { name: "Purple", value: "bg-purple-200 dark:bg-purple-900/30" }
];

export function NoteEditor({ onBack, onSave, courses, defaultTags }: NoteEditorProps) {
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    selectedText: string;
    startIndex: number;
    endIndex: number;
  } | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const courseCode = courses.find(c => c.id === courseId)?.code || "";

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (!selectedText) return;

    // Get selection indices
    const textarea = textareaRef.current;
    if (textarea && activeTab === "edit") {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        selectedText,
        startIndex: start,
        endIndex: end
      });
    } else if (previewRef.current && activeTab === "preview") {
      // For preview mode, calculate position in content
      const range = selection?.getRangeAt(0);
      if (range) {
        const startIndex = content.indexOf(selectedText);
        if (startIndex !== -1) {
          setContextMenu({
            show: true,
            x: e.clientX,
            y: e.clientY,
            selectedText,
            startIndex,
            endIndex: startIndex + selectedText.length
          });
        }
      }
    }
  };

  const handleHighlight = (color: string) => {
    if (!contextMenu) return;

    const newHighlight: Highlight = {
      id: Date.now().toString(),
      text: contextMenu.selectedText,
      color,
      startIndex: contextMenu.startIndex,
      endIndex: contextMenu.endIndex
    };

    setHighlights(prev => [...prev, newHighlight]);
    setContextMenu(null);
  };

  const handleAddComment = () => {
    if (!contextMenu || !commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      text: contextMenu.selectedText,
      content: commentText,
      position: { x: contextMenu.x, y: contextMenu.y },
      startIndex: contextMenu.startIndex,
      endIndex: contextMenu.endIndex
    };

    setComments(prev => [...prev, newComment]);
    setCommentText("");
    setShowCommentInput(false);
    setContextMenu(null);
  };

  const removeHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const removeComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleSave = () => {
    if (!title || !content) return;
    onSave({ title, courseId, courseCode, content, tags });
  };

  // Render content with highlights and comments
  const renderWithAnnotations = (text: string) => {
    if (highlights.length === 0 && comments.length === 0) return text;

    // Combine all annotations
    const annotations: Array<{ 
      text: string; 
      startIndex: number;
      endIndex: number;
      highlight?: Highlight;
      comment?: Comment;
    }> = [];

    highlights.forEach(h => {
      annotations.push({
        text: text.slice(h.startIndex, h.endIndex),
        startIndex: h.startIndex,
        endIndex: h.endIndex,
        highlight: h
      });
    });

    comments.forEach(c => {
      annotations.push({
        text: text.slice(c.startIndex, c.endIndex),
        startIndex: c.startIndex,
        endIndex: c.endIndex,
        comment: c
      });
    });

    // Sort by start index
    annotations.sort((a, b) => a.startIndex - b.startIndex);

    const parts: Array<JSX.Element | string> = [];
    let lastIndex = 0;

    annotations.forEach((annotation, idx) => {
      // Add text before annotation
      if (annotation.startIndex > lastIndex) {
        parts.push(text.slice(lastIndex, annotation.startIndex));
      }

      // Render annotation
      if (annotation.comment) {
        parts.push(
          <Popover key={`comment-${idx}`}>
            <PopoverTrigger asChild>
              <span className="underline decoration-dotted decoration-2 decoration-blue-500 cursor-help bg-blue-50 dark:bg-blue-950/20 px-0.5 rounded">
                {annotation.text}
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-80" side="top">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <p className="text-sm">Comment</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => removeComment(annotation.comment!.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <Separator />
                <p className="text-sm italic text-muted-foreground">"{annotation.text}"</p>
                <p className="text-sm">{annotation.comment.content}</p>
              </div>
            </PopoverContent>
          </Popover>
        );
      } else if (annotation.highlight) {
        parts.push(
          <mark key={`highlight-${idx}`} className={`${annotation.highlight.color} rounded px-0.5`}>
            {annotation.text}
          </mark>
        );
      }

      lastIndex = annotation.endIndex;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  // Simple markdown renderer
  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl mt-6 mb-3">{renderWithAnnotations(line.slice(2))}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl mt-5 mb-2">{renderWithAnnotations(line.slice(3))}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg mt-4 mb-2">{renderWithAnnotations(line.slice(4))}</h3>;
      if (line.startsWith('```')) return <div key={i} className="my-2" />;
      if (line.match(/^\d+\./)) return <li key={i} className="ml-6 list-decimal">{renderWithAnnotations(line.replace(/^\d+\.\s/, ''))}</li>;
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc">{renderWithAnnotations(line.slice(2))}</li>;
      
      let formattedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
      
      if (line.startsWith('>')) {
        return <blockquote key={i} className="border-l-4 border-primary pl-4 my-2 text-muted-foreground">{renderWithAnnotations(line.slice(1))}</blockquote>;
      }
      
      return line ? <p key={i} className="my-2">{renderWithAnnotations(line)}</p> : <br key={i} />;
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} disabled={!title || !content}>
              <Save className="w-4 h-4 mr-2" />
              Save Note
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-5xl mx-auto px-6 py-8 overflow-y-auto">
          {/* Title */}
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-4xl border-none px-0 mb-6 placeholder:text-muted-foreground/50"
          />

          {/* Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {defaultTags.filter(tag => !tags.includes(tag)).slice(0, 8).map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => handleAddTag(tag)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Editor Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
            <TabsList className="mb-4">
              <TabsTrigger value="edit">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="mt-0">
              <Textarea 
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onContextMenu={handleContextMenu}
                placeholder="Start writing your notes in markdown...

# Heading 1
## Heading 2
### Heading 3

**Bold text**
*Italic text*
`Code`

- Bullet point
1. Numbered list

> Blockquote"
                className="min-h-[600px] font-mono text-sm resize-none border-none focus-visible:ring-0 px-0"
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div 
                ref={previewRef}
                onContextMenu={handleContextMenu}
                className="min-h-[600px] prose prose-sm max-w-none"
              >
                {content ? renderMarkdown(content) : (
                  <p className="text-muted-foreground text-center py-12">
                    Preview will appear here...
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Highlights Sidebar (Comments appear on hover) */}
          {highlights.length > 0 && (
            <Card className="mt-6 p-4">
              <h3 className="mb-4">Annotations</h3>
              
              <div>
                <h4 className="text-sm mb-2 flex items-center gap-2">
                  <Highlighter className="w-4 h-4" />
                  Highlights ({highlights.length})
                </h4>
                <div className="space-y-2">
                  {highlights.map(highlight => (
                    <div key={highlight.id} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                      <div className={`w-4 h-4 rounded mt-1 ${highlight.color}`} />
                      <p className="flex-1 text-sm">{highlight.text}</p>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removeHighlight(highlight.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {comments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Comments ({comments.length})
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Hover over underlined text to view comments
                  </p>
                </div>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu?.show && (
        <div 
          className="fixed bg-card border border-border rounded-lg shadow-lg p-1 z-50"
          style={{ 
            left: contextMenu.x, 
            top: contextMenu.y,
            transform: 'translateY(-100%) translateY(-8px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col min-w-48">
            <div className="px-3 py-2 text-sm border-b border-border">
              <p className="text-muted-foreground">Selected text</p>
            </div>
            
            <div className="py-1">
              <div className="px-3 py-1 text-sm mb-1 text-muted-foreground">
                <Highlighter className="w-3 h-3 inline mr-2" />
                Highlight
              </div>
              {HIGHLIGHT_COLORS.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleHighlight(color.value)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded flex items-center gap-2"
                >
                  <div className={`w-4 h-4 rounded ${color.value}`} />
                  {color.name}
                </button>
              ))}
            </div>

            <Separator />

            <div className="py-1">
              {!showCommentInput ? (
                <button
                  onClick={() => setShowCommentInput(true)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent rounded flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Comment
                </button>
              ) : (
                <div className="p-2">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="mb-2"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleAddComment}>
                      Add
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setShowCommentInput(false);
                        setCommentText("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
