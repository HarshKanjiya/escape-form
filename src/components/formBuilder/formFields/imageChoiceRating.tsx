import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { Card } from "@/components/ui/card";
import { Check, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface ImageChoiceRatingProps {
    question: IQuestion;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
}

// Default emotion images with emojis as fallback
const defaultImages = [
    { value: "1", emoji: "😢", label: "Very Dissatisfied" },
    { value: "2", emoji: "😕", label: "Dissatisfied" },
    { value: "3", emoji: "😐", label: "Neutral" },
    { value: "4", emoji: "🙂", label: "Satisfied" },
    { value: "5", emoji: "😊", label: "Very Satisfied" }
];

export function ImageChoiceRating({ question, value = "", onChange, disabled = false }: ImageChoiceRatingProps) {
    const [hoverValue, setHoverValue] = useState("");

    const handleImageClick = (imageValue: string) => {
        if (!disabled) {
            onChange?.(imageValue);
        }
    };

    const handleImageHover = (imageValue: string) => {
        if (!disabled) {
            setHoverValue(imageValue);
        }
    };

    const handleMouseLeave = () => {
        setHoverValue("");
    };

    // Use custom options if provided, otherwise use default emotion images
    const images = question.options?.map((option, index) => ({
        value: (index + 1).toString(),
        emoji: defaultImages[index]?.emoji || "⭐",
        label: option
    })) || defaultImages;

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">
                    {question.title}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                )}
            </div>

            <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
                onMouseLeave={handleMouseLeave}
            >
                {images.map((image, index) => {
                    const isSelected = value === image.value;
                    const isHovered = hoverValue === image.value;
                    
                    return (
                        <Card
                            key={index}
                            className={`relative cursor-pointer transition-all duration-200 hover:shadow-md ${
                                disabled 
                                    ? 'cursor-not-allowed opacity-50' 
                                    : 'hover:scale-105'
                            } ${
                                isSelected || isHovered
                                    ? 'ring-2 ring-primary bg-primary/5'
                                    : 'hover:ring-1 hover:ring-primary/50'
                            }`}
                            onClick={() => handleImageClick(image.value)}
                            onMouseEnter={() => handleImageHover(image.value)}
                        >
                            <div className="p-4 flex flex-col items-center text-center space-y-2">
                                {/* Emoji or placeholder image */}
                                <div className="text-4xl mb-2">
                                    {image.emoji || <ImageIcon className="h-8 w-8 text-muted-foreground" />}
                                </div>
                                
                                {/* Label */}
                                <span className="text-xs font-medium text-muted-foreground">
                                    {image.label}
                                </span>
                                
                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2">
                                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                                            <Check className="h-3 w-3" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
            
            {value && (
                <div className="text-center">
                    <span className="text-sm font-medium text-foreground">
                        Selected: {images.find(img => img.value === value)?.label}
                    </span>
                </div>
            )}
        </div>
    );
}
