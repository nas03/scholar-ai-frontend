import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    title: string;
    type: "video" | "pdf" | "text" | "link" | "other";
    url: string;
    description: string;
    size: string;
  };
  onFormChange: (data: any) => void;
  onSubmit: () => void;
}

export function AddMaterialDialog({
  open,
  onOpenChange,
  formData,
  onFormChange,
  onSubmit
}: AddMaterialDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Study Material</DialogTitle>
          <DialogDescription>
            Add a video, PDF, link, or other study resource
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="material-title">Title *</Label>
            <Input
              id="material-title"
              placeholder="e.g., Lecture 5 - Data Structures"
              value={formData.title}
              onChange={(e) => onFormChange({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="material-type">Type *</Label>
            <Select value={formData.type} onValueChange={(value: any) => onFormChange({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="text">Text File</SelectItem>
                <SelectItem value="link">Web Link</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.type === "link" || formData.type === "video") && (
            <div className="space-y-2">
              <Label htmlFor="material-url">URL</Label>
              <Input
                id="material-url"
                placeholder="https://..."
                value={formData.url}
                onChange={(e) => onFormChange({ ...formData, url: e.target.value })}
              />
            </div>
          )}

          {(formData.type === "pdf" || formData.type === "text") && (
            <div className="space-y-2">
              <Label htmlFor="material-size">File Size</Label>
              <Input
                id="material-size"
                placeholder="e.g., 2.4 MB"
                value={formData.size}
                onChange={(e) => onFormChange({ ...formData, size: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Note: Actual file upload is not implemented in this prototype
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="material-description">Description</Label>
            <Textarea
              id="material-description"
              placeholder="Brief description of the material"
              value={formData.description}
              onChange={(e) => onFormChange({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <Button 
          onClick={onSubmit} 
          disabled={!formData.title}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </DialogContent>
    </Dialog>
  );
}
