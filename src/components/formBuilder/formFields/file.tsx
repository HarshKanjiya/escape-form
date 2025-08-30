import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FileUploadProps {
    question: IQuestion;
    value?: File[];
    onChange?: (value: File[]) => void;
    disabled?: boolean;
}

export function FileUpload({ question, value = [], onChange, disabled = false }: FileUploadProps) {
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        onChange?.([...value, ...files]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        onChange?.([...value, ...files]);
    };

    const removeFile = (index: number) => {
        const newFiles = value.filter((_, i) => i !== index);
        onChange?.(newFiles);
    };

    return (
        <div className="space-y-4">
            <Label className="text-sm font-medium">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {question.description && (
                <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"}`}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !disabled && document.getElementById(`file-${question.id}`)?.click()}
            >
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                    Drop files here or click to browse
                </p>
                <Input
                    id={`file-${question.id}`}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={disabled}
                    required={question.required && value.length === 0}
                />
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Selected Files:</Label>
                    {value.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center space-x-2">
                                <File className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm truncate">{file.name}</span>
                                <span className="text-xs text-muted-foreground">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                disabled={disabled}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
