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
interface AddSemesterDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	formData: {
		name: string;
		startDate: string;
		endDate: string;
	};
	onFormChange: (data: any) => void;
	onSubmit: () => void;
}

export function AddSemesterDialog({
	open,
	onOpenChange,
	formData,
	onFormChange,
	onSubmit,
}: AddSemesterDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Semester</DialogTitle>
					<DialogDescription>
						Create a new semester to organize your courses
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="semester-name">Semester Name *</Label>
						<Input
							id="semester-name"
							placeholder="e.g., Fall 2024"
							value={formData.name}
							onChange={(e) =>
								onFormChange({ ...formData, name: e.target.value })
							}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="start-date">Start Date</Label>
							<Input
								id="start-date"
								type="date"
								value={formData.startDate}
								onChange={(e) =>
									onFormChange({ ...formData, startDate: e.target.value })
								}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="end-date">End Date</Label>
							<Input
								id="end-date"
								type="date"
								value={formData.endDate}
								onChange={(e) =>
									onFormChange({ ...formData, endDate: e.target.value })
								}
							/>
						</div>
					</div>
				</div>

				<Button onClick={onSubmit} disabled={!formData.name} className="w-full">
					<Plus className="w-4 h-4 mr-2" />
					Add Semester
				</Button>
			</DialogContent>
		</Dialog>
	);
}
