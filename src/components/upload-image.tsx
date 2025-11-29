import { Button } from "@/components/ui/button";
import { Upload,  Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SingleImageUploadProps {
  /**
   * The current value: can be a File (new upload) or a string (server URL)
   */
  value: File | string | null;
  /**
   * Callback when the file changes
   */
  onChange: (file: File | null) => void;
  /**
   * Optional custom class names
   */
  className?: string;
  /**
   * Disable the input
   */
  disabled?: boolean;
}

export function SingleImageUpload({
  value,
  onChange,
  className,
  disabled = false,
}: SingleImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle Preview URL generation
  useEffect(() => {
    if (typeof value === "string") {
      // It's a server URL
      setPreviewUrl(value);
    } else if (value instanceof File) {
      // It's a local file
      const objectUrl = URL.createObjectURL(value);
      setPreviewUrl(objectUrl);

      // Cleanup memory when component unmounts or file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [value]);

  // Helper to calculate file size if available
  const formatFileSize = (size: number) => {
    return `${Math.round(size / 1024)} KB`;
  };

  // --- Event Handlers ---

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      // Optional: Validate type here if needed (e.g. if (!droppedFile.type.startsWith('image/')))
      onChange(droppedFile);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent clicks
    onChange(null);
    // Reset input value so same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTriggerClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  // --- Render: Preview Mode (Image Exists) ---
  if (value && previewUrl) {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="border border-border rounded-lg p-2 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {/* Image Thumbnail */}
            <div className="relative w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0 border">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* File Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {value instanceof File ? value.name : "Existing Image"}
              </p>
              <p className="text-xs text-muted-foreground">
                {value instanceof File
                  ? formatFileSize(value.size)
                  : "Server Image"}
              </p>
            </div>

            {/* Remove Button */}
            {!disabled && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleRemove}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- Render: Dropzone Mode (No Image) ---
  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8
          flex flex-col items-center justify-center text-center
          transition-colors duration-200 ease-in-out
          ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={handleTriggerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-4 bg-muted rounded-full p-3">
          <Upload className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Upload a project image
          </p>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse (4MB max)
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={disabled}
        />
      </div>
    </div>
  );
}