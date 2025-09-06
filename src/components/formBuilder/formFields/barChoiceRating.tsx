import { IQuestion } from "@/types/form";


interface IProps {
    question: IQuestion,
    index: number
}

export function BarChoiceRatingField({ question, index }: IProps) {
    // const [hoverValue, setHoverValue] = useState(0);
    // const maxValue: number = Number(question.validation?.max) || 10;
    // const minValue: number = Number(question.validation?.min) || 1;

    // const handleBarClick = (rating: number) => {
    //     if (!disabled) {
    //         onChange?.(rating);
    //     }
    // };

    // const handleBarHover = (rating: number) => {
    //     if (!disabled) {
    //         setHoverValue(rating);
    //     }
    // };

    // const handleMouseLeave = () => {
    //     setHoverValue(0);
    // };

    // const getBarColor = (barValue: number) => {
    //     const currentValue = hoverValue || value;
    //     if (barValue <= currentValue) {
    //         const percentage = (barValue / maxValue) * 100;
    //         if (percentage <= 33) return 'bg-red-500';
    //         if (percentage <= 66) return 'bg-yellow-500';
    //         return 'bg-green-500';
    //     }
    //     return 'bg-gray-200 hover:bg-gray-300';
    // };

    return (
        <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
            <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
                <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
            </div>
            <div className="space-y-4 w-full flex-1">
                {/* <div>
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
            </div> */}
            </div>
        </div>
    );
}
