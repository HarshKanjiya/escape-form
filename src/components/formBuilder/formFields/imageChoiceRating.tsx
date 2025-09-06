import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { IQuestion } from "@/types/form";
import { useEffect, useRef, useState } from "react";


interface IProps {
    question: IQuestion,
    index: number
}

// Default emotion images with emojis as fallback
const defaultImages = [
    { value: "1", emoji: "😢", label: "Very Dissatisfied" },
    { value: "2", emoji: "😕", label: "Dissatisfied" },
    { value: "3", emoji: "😐", label: "Neutral" },
    { value: "4", emoji: "🙂", label: "Satisfied" },
    { value: "5", emoji: "😊", label: "Very Satisfied" }
];

export function ImageChoiceRating({ question, index }: IProps) {
    // const [hoverValue, setHoverValue] = useState("");

    // const handleImageClick = (imageValue: string) => {
    //     if (!disabled) {
    //         onChange?.(imageValue);
    //     }
    // };

    // const handleImageHover = (imageValue: string) => {
    //     if (!disabled) {
    //         setHoverValue(imageValue);
    //     }
    // };

    // const handleMouseLeave = () => {
    //     setHoverValue("");
    // };

    // // Use custom options if provided, otherwise use default emotion images
    // const images = question.options?.map((option, index) => ({
    //     value: (index + 1).toString(),
    //     emoji: defaultImages[index]?.emoji || "⭐",
    //     label: option
    // })) || defaultImages;

    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1">            {/* <div>
                <Label className="text-sm font-medium">
                    {question.question}
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
                                <div className="text-4xl mb-2">
                                    {image.emoji || <ImageIcon className="h-8 w-8 text-muted-foreground" />}
                                </div>
                                
                                <span className="text-xs font-medium text-muted-foreground">
                                    {image.label}
                                </span>
                                
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
            )} */}
            </div>
        </div>
    );
}
