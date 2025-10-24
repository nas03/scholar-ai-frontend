import { Plus } from 'lucide-react';
import * as React from 'react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from '../../ui/textarea';
import { SchedulePicker, ScheduleTime } from '../SchedulePicker';
import { colorOptions } from './utils';
interface AddCourseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: {
		name: string;
		code: string;
		instructor: string;
		scheduleDetails: ScheduleTime[];
		location: string;
		description: string;
		color: string;
		credits: string;
		semester: string;
		gpa: string;
	};
	onFormChange: (data: any) => void;
	onSubmit: () => void;
	semesters: Array<{
		id: string;
		name: string;
		startDate: string;
		endDate: string;
	}>;
}

export function AddCourseDialog({
	open,
	onOpenChange,
	formData,
	onFormChange,
	onSubmit,
	semesters,
}: AddCourseDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add New Course</DialogTitle>
					<DialogDescription>
						Add a course you're taking this semester
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="code">Course Code *</Label>
							<Input
								id="code"
								placeholder="e.g., CS101"
								value={formData.code}
								onChange={(e) =>
									onFormChange({ ...formData, code: e.target.value })
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="credits">Credits *</Label>
							<Input
								id="credits"
								type="number"
								placeholder="e.g., 3"
								value={formData.credits}
								onChange={(e) =>
									onFormChange({ ...formData, credits: e.target.value })
								}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="name">Course Name *</Label>
						<Input
							id="name"
							placeholder="e.g., Introduction to Computer Science"
							value={formData.name}
							onChange={(e) =>
								onFormChange({ ...formData, name: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="semester">Semester</Label>
						<Select
							value={formData.semester}
							onValueChange={(value) =>
								onFormChange({ ...formData, semester: value })
							}>
							<SelectTrigger>
								<SelectValue placeholder="Select semester" />
							</SelectTrigger>
							<SelectContent>
								{semesters.map((semester) => (
									<SelectItem key={semester.id} value={semester.name}>
										{semester.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="instructor">Instructor</Label>
						<Input
							id="instructor"
							placeholder="e.g., Dr. Jane Smith"
							value={formData.instructor}
							onChange={(e) =>
								onFormChange({ ...formData, instructor: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="location">Location</Label>
						<Input
							id="location"
							placeholder="e.g., Room 301, Building A"
							value={formData.location}
							onChange={(e) =>
								onFormChange({ ...formData, location: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<SchedulePicker
							value={formData.scheduleDetails}
							onChange={(value) =>
								onFormChange({ ...formData, scheduleDetails: value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="gpa">Current GPA (0.0 - 4.0)</Label>
						<Input
							id="gpa"
							type="number"
							step="0.1"
							min="0"
							max="4"
							placeholder="e.g., 3.5"
							value={formData.gpa}
							onChange={(e) =>
								onFormChange({ ...formData, gpa: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="color">Color Theme</Label>
						<Select
							value={formData.color}
							onValueChange={(value) =>
								onFormChange({ ...formData, color: value })
							}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{colorOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										<div className="flex items-center gap-2">
											<div className={`w-4 h-4 rounded ${option.value}`} />
											{option.label}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Brief description of the course"
							value={formData.description}
							onChange={(e) =>
								onFormChange({ ...formData, description: e.target.value })
							}
							rows={3}
						/>
					</div>
				</div>

				<Button
					onClick={onSubmit}
					disabled={!formData.name || !formData.code || !formData.credits}
					className="w-full">
					<Plus className="w-4 h-4 mr-2" />
					Add Course
				</Button>
			</DialogContent>
		</Dialog>
	);
}
