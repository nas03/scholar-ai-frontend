import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  File,
  FileText,
  FolderOpen,
  Link as LinkIcon,
  Plus,
  StickyNote,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import * as React from 'react';
import { useState } from 'react';
import { Course } from '../../../types';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';

interface CourseDetailsProps {
	course: Course;
	courseNotes: any[];
	courseMaterials: any[];
	onBack: () => void;
	onEditCourse: (course: Course) => void;
	onAddMaterial: () => void;
	onAddNote: () => void;
	onDeleteMaterial: (id: string) => void;
}

export function CourseDetails({
	course,
	courseNotes,
	courseMaterials,
	onBack,
	onEditCourse,
	onAddMaterial,
	onAddNote,
	onDeleteMaterial,
}: CourseDetailsProps) {
	const getMaterialIcon = (type: string) => {
		switch (type) {
			case 'video':
				return <Video className="w-5 h-5 text-red-600" />;
			case 'pdf':
				return <FileText className="w-5 h-5 text-red-500" />;
			case 'text':
				return <File className="w-5 h-5 text-blue-600" />;
			case 'link':
				return <LinkIcon className="w-5 h-5 text-purple-600" />;
			default:
				return <File className="w-5 h-5 text-gray-600" />;
		}
	};

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<Button variant="ghost" onClick={onBack} className="mb-4">
				<ArrowLeft className="w-4 h-4 mr-2" />
				Back to Courses
			</Button>

			{/* Course Header */}
			<Card className="overflow-hidden mb-6">
				<div className={`h-3 ${course.color}`} />
				<div className="p-6">
					<div className="flex items-start justify-between mb-4">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-3xl">{course.code}</h2>
								{course.credits && (
									<Badge variant="secondary" className="text-base">
										{course.credits} Credits
									</Badge>
								)}
								{course.gpa !== undefined && (
									<Badge className="bg-green-500 text-base">
										GPA: {course.gpa.toFixed(2)}
									</Badge>
								)}
							</div>
							<p className="text-xl mb-2">{course.name}</p>
							{course.description && (
								<p className="text-muted-foreground mb-4">
									{course.description}
								</p>
							)}
							<div className="flex flex-wrap gap-4 text-sm">
								{course.instructor && (
									<div className="flex items-center gap-2">
										<BookOpen className="w-4 h-4 text-muted-foreground" />
										<span>{course.instructor}</span>
									</div>
								)}
								{course.schedule && (
									<div className="flex items-center gap-2">
										<Clock className="w-4 h-4 text-muted-foreground" />
										<span>{course.schedule}</span>
									</div>
								)}
								{course.semester && (
									<div className="flex items-center gap-2">
										<Calendar className="w-4 h-4 text-muted-foreground" />
										<span>{course.semester}</span>
									</div>
								)}
							</div>
						</div>
						<Button variant="outline" onClick={() => onEditCourse(course)}>
							<Edit className="w-4 h-4 mr-2" />
							Edit Course
						</Button>
					</div>

					<Separator className="my-4" />

					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
								<StickyNote className="w-6 h-6 text-green-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Lecture Notes</p>
								<p className="text-2xl">{courseNotes.length}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
								<FolderOpen className="w-6 h-6 text-blue-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Study Materials</p>
								<p className="text-2xl">{courseMaterials.length}</p>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
								<Calendar className="w-6 h-6 text-purple-600" />
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Total Resources</p>
								<p className="text-2xl">
									{courseNotes.length + courseMaterials.length}
								</p>
							</div>
						</div>
					</div>
				</div>
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="materials" className="space-y-4">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="materials">Study Materials</TabsTrigger>
					<TabsTrigger value="notes">Lecture Notes</TabsTrigger>
				</TabsList>

				<TabsContent value="materials" className="space-y-4">
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3>Study Materials</h3>
							<Button onClick={onAddMaterial}>
								<Upload className="w-4 h-4 mr-2" />
								Add Material
							</Button>
						</div>

						{courseMaterials.length === 0 ? (
							<div className="text-center py-12">
								<FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
								<h4 className="mb-2">No materials yet</h4>
								<p className="text-sm text-muted-foreground mb-6">
									Add videos, PDFs, links, and other study materials for this
									course
								</p>
								<Button onClick={onAddMaterial}>
									<Upload className="w-4 h-4 mr-2" />
									Add Your First Material
								</Button>
							</div>
						) : (
							<div className="space-y-3">
								{courseMaterials.map((material) => (
									<div
										key={material.id}
										className="p-4 rounded-lg border border-border hover:bg-accent transition-colors">
										<div className="flex items-start gap-3">
											{getMaterialIcon(material.type)}
											<div className="flex-1 min-w-0">
												<div className="flex items-start justify-between mb-1">
													<h4 className="truncate">{material.title}</h4>
													<Button
														variant="ghost"
														size="icon"
														className="flex-shrink-0"
														onClick={() => {
															if (confirm('Delete this material?')) {
																onDeleteMaterial(material.id);
															}
														}}>
														<Trash2 className="w-4 h-4" />
													</Button>
												</div>
												{material.description && (
													<p className="text-sm text-muted-foreground mb-2">
														{material.description}
													</p>
												)}
												<div className="flex items-center gap-4 text-xs text-muted-foreground">
													<Badge variant="outline" className="text-xs">
														{material.type.toUpperCase()}
													</Badge>
													<span>{material.uploadDate}</span>
													{material.size && <span>{material.size}</span>}
												</div>
												{material.url && (
													<a
														href={material.url}
														target="_blank"
														rel="noopener noreferrer"
														className="text-xs text-primary hover:underline mt-2 inline-block">
														Open link →
													</a>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				</TabsContent>

				<TabsContent value="notes" className="space-y-4">
					<Card className="p-6">
						<div className="flex items-center justify-between mb-4">
							<h3>Lecture Notes</h3>
							<Button onClick={onAddNote}>
								<Plus className="w-4 h-4 mr-2" />
								Create Note
							</Button>
						</div>

						{courseNotes.length === 0 ? (
							<div className="text-center py-12">
								<StickyNote className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
								<h4 className="mb-2">No lecture notes yet</h4>
								<p className="text-sm text-muted-foreground mb-6">
									Create notes for this course to keep your study materials
									organized
								</p>
								<Button onClick={onAddNote}>
									<Plus className="w-4 h-4 mr-2" />
									Create Your First Note
								</Button>
							</div>
						) : (
							<div className="space-y-3">
								{courseNotes.map((note) => (
									<div
										key={note.id}
										className="p-4 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer">
										<div className="flex items-start justify-between mb-2">
											<h4>{note.title}</h4>
											<Badge variant="secondary">{note.pages} pages</Badge>
										</div>
										<div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
											<Calendar className="w-4 h-4" />
											<span>{note.date}</span>
										</div>
										<div className="flex flex-wrap gap-2">
											{note.tags.map((tag: string, index: number) => (
												<Badge
													key={index}
													variant="outline"
													className="text-xs">
													{tag}
												</Badge>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
