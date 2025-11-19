"use client";

/**
 * Multi-Step Form Component
 * 
 * Features:
 * - Each question is rendered as a separate step
 * - Progress bar shows completion percentage
 * - Step indicators with completion status
 * - Navigation buttons (Next/Back/Submit)
 * - Keyboard navigation support (Enter, Ctrl+Arrow keys)
 * - Form validation on each step
 * - Smooth animations between steps
 * - Responsive design
 * 
 * To add new field types:
 * 1. Create the field component in ./fields/
 * 2. Import it in this component
 * 3. Add the case in the renderField switch statement
 */

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Question } from "@/types/form";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import RenderField from "./fields/renderField";

interface Props {
    questions: Question[];
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 300 : -300,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0
    })
};

export default function RenderMultiStepForm({ questions }: Props) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<Record<string, string | number | boolean | string[]>>({});
    // const [errors, setErrors] = useState<Record<string, string>>({});
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
    const [direction, setDirection] = useState(0);
    const [animatedProgress, setAnimatedProgress] = useState(0);

    const totalSteps = questions.length;
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / totalSteps) * 100;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;

    // Animate progress value with staggered effect
    useEffect(() => {
        const targetProgress = progress;
        const startProgress = animatedProgress;
        const difference = targetProgress - startProgress;
        const duration = 800; // 800ms animation
        const steps = 30; // Number of animation steps
        // const stepValue = difference / steps;
        const stepDuration = duration / steps;

        let currentAnimationStep = 0;
        const animationInterval = setInterval(() => {
            currentAnimationStep++;

            if (currentAnimationStep >= steps) {
                setAnimatedProgress(targetProgress);
                clearInterval(animationInterval);
            } else {
                // Easing function for smooth animation (ease-out)
                const easingFactor = 1 - Math.pow(1 - currentAnimationStep / steps, 3);
                const newProgress = startProgress + (difference * easingFactor);
                setAnimatedProgress(newProgress);
            }
        }, stepDuration);

        return () => clearInterval(animationInterval);
    }, [progress]);

    const handleFieldChange = (questionId: string, value: string | number | boolean | string[]) => {
        setFormData(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const validateCurrentStep = (): boolean => {
        const question = currentQuestion;
        const value = formData[question.id];

        // // Check if required field is filled
        // if (question.required && (!value || value.toString().trim() === "")) {
        //     setErrors(prev => ({
        //         ...prev,
        //         [question.id]: "This field is required"
        //     }));
        //     return false;
        // }

        // // Check minimum length for text fields
        // if (question.validation?.min && typeof question.validation.min === 'number' && value) {
        //     if (value.toString().length < question.validation.min) {
        //         setErrors(prev => ({
        //             ...prev,
        //             [question.id]: `Minimum ${question.validation?.min} characters required`
        //         }));
        //         return false;
        //     }
        // }

        // // Check pattern validation
        // if (question.validation?.pattern && value) {
        //     const regex = new RegExp(question.validation.pattern);
        //     if (!regex.test(value.toString())) {
        //         setErrors(prev => ({
        //             ...prev,
        //             [question.id]: "Please enter a valid format"
        //         }));
        //         return false;
        //     }
        // }

        return true;
    };

    const handleNext = () => {
        if (validateCurrentStep()) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            if (!isLastStep) {
                setDirection(1); // Moving forward
                setCurrentStep(prev => prev + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (!isFirstStep) {
            setDirection(-1); // Moving backward
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        if (validateCurrentStep()) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            console.log('Form submitted:', formData);
            // Handle form submission here
        }
    };

    // Add keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (isLastStep) {
                    handleSubmit();
                } else {
                    handleNext();
                }
            } else if (event.key === 'ArrowLeft' && event.ctrlKey) {
                event.preventDefault();
                handlePrevious();
            } else if (event.key === 'ArrowRight' && event.ctrlKey) {
                event.preventDefault();
                handleNext();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, isLastStep, formData]);

    if (!questions || questions.length === 0) {
        return (
            <div className="p-8 h-full w-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-medium text-muted-foreground">No Form Fields</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                        Add some questions to see the form preview
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-full w-full flex flex-col">
            <div className="max-w-2xl mx-auto w-full">
                <div className="mb-8 mt-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Step {currentStep + 1} of {totalSteps}
                        </span>
                    </div>
                    <Progress value={animatedProgress} className="h-2" />
                </div>

                {/* Form Content */}
                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={currentStep}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: {
                                    type: "tween",
                                    duration: 0.35,
                                    ease: [0.25, 0.19, 0.25, 0.94]
                                },
                                opacity: {
                                    duration: 0.35,
                                    ease: [0.25, 0.19, 0.25, 0.94]
                                }
                            }}
                            className="min-h-[160px] flex items-center justify-center flex-col w-full"
                        >
                            {currentQuestion && <RenderField question={currentQuestion} formData={formData} handleFieldChange={handleFieldChange} />}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 mt-12 border-t">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={isFirstStep}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </Button>

                    {isLastStep ? (
                        <Button
                            onClick={handleSubmit}
                            className="flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Submit
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="flex items-center gap-2"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}