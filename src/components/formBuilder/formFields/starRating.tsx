import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
    question: IQuestion;
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
}

export function StarRating({ question, value = 0, onChange, disabled = false }: StarRatingProps) {
    const [hoverValue, setHoverValue] = useState(0);
    const maxStars = question.validation?.max || 5;

    const handleStarClick = (rating: number) => {
        if (!disabled) {
            onChange?.(rating);
        }
    };

    const handleStarHover = (rating: number) => {
        if (!disabled) {
            setHoverValue(rating);
        }
    };

    const handleMouseLeave = () => {
        setHoverValue(0);
    };

    return (
        <div className="space-y-4">
            <div>
                <Label className="text-sm font-medium">
                    {question.question}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                    <p className="text-sm text-muted-foreground mt-1">{question.description}</p>
                )}
            </div>

            <div className="space-y-2">
                <div 
                    className="flex items-center gap-1"
                    onMouseLeave={handleMouseLeave}
                >
                    {Array.from({ length: maxStars }, (_, index) => {
                        const starValue = index + 1;
                        const isFilled = starValue <= (hoverValue || value);
                        
                        return (
                            <button
                                key={index}
                                type="button"
                                className={`transition-colors duration-200 ${
                                    disabled 
                                        ? 'cursor-not-allowed opacity-50' 
                                        : 'cursor-pointer hover:scale-110'
                                }`}
                                onClick={() => handleStarClick(starValue)}
                                onMouseEnter={() => handleStarHover(starValue)}
                                disabled={disabled}
                                aria-label={`Rate ${starValue} out of ${maxStars} stars`}
                            >
                                <Star
                                    className={`h-8 w-8 transition-colors duration-200 ${
                                        isFilled
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300 hover:text-yellow-300'
                                    }`}
                                />
                            </button>
                        );
                    })}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Poor</span>
                    {value > 0 && (
                        <span className="font-medium text-foreground">
                            {value} out of {maxStars} stars
                        </span>
                    )}
                    <span>Excellent</span>
                </div>
            </div>
        </div>
    );
}
