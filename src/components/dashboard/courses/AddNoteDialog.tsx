import { Plus } from 'lucide-react';
import * as React from 'react';
import { Badge } from '../../ui/badge';
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
interface AddNoteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	courseCode: string;
	formData: {
		title: string;
		tags: string[];
		pages: string;
	};
	onFormChange: (data: any) => void;
	onSubmit: () => void;
}

export function AddNoteDialog({
	open,
	onOpenChange,
	courseCode,
	formData,
	onFormChange,
	onSubmit,
}: AddNoteDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Create Lecture Note</DialogTitle>
					<DialogDescription>
						Create a new note for {courseCode}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="note-title">Note Title *</Label>
						<Input
							id="note-title"
							placeholder="e.g., Week 5 - Binary Search Trees"
							value={formData.title}
							onChange={(e) =>
								onFormChange({ ...formData, title: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="note-pages">Number of Pages</Label>
						<Input
							id="note-pages"
							type="number"
							placeholder="e.g., 5"
							value={formData.pages}
							onChange={(e) =>
								onFormChange({ ...formData, pages: e.target.value })
							}
						/>
					</div>

					<div className="space-y-2">
						<Label>Tags (Press Enter to add)</Label>
						<Input
							placeholder="e.g., Algorithms"
							onKeyDown={(e) => {
								if (e.key === 'Enter' && e.currentTarget.value) {
									e.preventDefault();
									if (!formData.tags.includes(e.currentTarget.value)) {
										onFormChange({
											...formData,
											tags: [...formData.tags, e.currentTarget.value],
										});
									}
									e.currentTarget.value = '';
								}
							}}
						/>
						<div className="flex flex-wrap gap-2 mt-2">
							{formData.tags.map((tag, index) => (
								<Badge
									key={index}
									variant="secondary"
									className="cursor-pointer"
									onClick={() =>
										onFormChange({
											...formData,
											tags: formData.tags.filter((_, i) => i !== index),
										})
									}>
									{tag} ×
								</Badge>
							))}
						</div>
					</div>

					<p className="text-sm text-muted-foreground">
						Note: The full note editor will open in the Lecture Notes section
						after creation
					</p>
				</div>

				<Button
					onClick={onSubmit}
					disabled={!formData.title}
					className="w-full">
					<Plus className="w-4 h-4 mr-2" />
					Create Note
				</Button>
			</DialogContent>
		</Dialog>
	);
}
