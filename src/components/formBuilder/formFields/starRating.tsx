import { IQuestion } from "@/types/form";
import { useState } from "react";


interface IProps {
    question: IQuestion,
    index: number
}

export function StarRatingField({ question, index }: IProps) {
    // const [hoverValue, setHoverValue] = useState(0);
    // const maxStars = typeof question.validation?.max === "number" ? question.validation.max : 5;

    // const handleStarClick = (rating: number) => {
    //     if (!disabled) {
    //         onChange?.(rating);
    //     }
    // };

    // const handleStarHover = (rating: number) => {
    //     if (!disabled) {
    //         setHoverValue(rating);
    //     }
    // };

    // const handleMouseLeave = () => {
    //     setHoverValue(0);
    // };

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

            <div className="space-y-2">
                <div 
                    className="flex items-center gap-1"
                    onMouseLeave={handleMouseLeave}
                >
                    {Array.from({ length: maxStars as number }, (_, index) => {
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
            </div> */}
        </div>
        </div>
    );
}
