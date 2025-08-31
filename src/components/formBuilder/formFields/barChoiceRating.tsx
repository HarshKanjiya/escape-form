import { Label } from "@/components/ui/label";
import { IQuestion } from "@/types/form";
import { useState } from "react";

interface BarChoiceRatingProps {
    question: IQuestion;
    value?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
}

export function BarChoiceRating({ question, value = 0, onChange, disabled = false }: BarChoiceRatingProps) {
    const [hoverValue, setHoverValue] = useState(0);
    const maxValue = question.validation?.max || 10;
    const minValue = question.validation?.min || 1;

    const handleBarClick = (rating: number) => {
        if (!disabled) {
            onChange?.(rating);
        }
    };

    const handleBarHover = (rating: number) => {
        if (!disabled) {
            setHoverValue(rating);
        }
    };

    const handleMouseLeave = () => {
        setHoverValue(0);
    };

    const getBarColor = (barValue: number) => {
        const currentValue = hoverValue || value;
        if (barValue <= currentValue) {
            const percentage = (barValue / maxValue) * 100;
            if (percentage <= 33) return 'bg-red-500';
            if (percentage <= 66) return 'bg-yellow-500';
            return 'bg-green-500';
        }
        return 'bg-gray-200 hover:bg-gray-300';
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

            <div className="space-y-3">
                <div 
                    className="flex items-end gap-1 h-32"
                    onMouseLeave={handleMouseLeave}
                >
                    {Array.from({ length: maxValue - minValue + 1 }, (_, index) => {
                        const barValue = minValue + index;
                        const height = ((barValue - minValue + 1) / (maxValue - minValue + 1)) * 100;
                        
                        return (
                            <div
                                key={index}
                                className="flex flex-col items-center gap-1 flex-1"
                            >
                                <button
                                    type="button"
                                    className={`w-full transition-all duration-200 rounded-t-sm ${
                                        disabled 
                                            ? 'cursor-not-allowed opacity-50' 
                                            : 'cursor-pointer hover:scale-105'
                                    } ${getBarColor(barValue)}`}
                                    style={{ height: `${height}%` }}
                                    onClick={() => handleBarClick(barValue)}
                                    onMouseEnter={() => handleBarHover(barValue)}
                                    disabled={disabled}
                                    aria-label={`Rate ${barValue} out of ${maxValue}`}
                                />
                                <span className="text-xs text-muted-foreground">
                                    {barValue}
                                </span>
                            </div>
                        );
                    })}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Low</span>
                    {value > 0 && (
                        <span className="font-medium text-foreground">
                            Rating: {value}/{maxValue}
                        </span>
                    )}
                    <span>High</span>
                </div>
            </div>
        </div>
    );
}
