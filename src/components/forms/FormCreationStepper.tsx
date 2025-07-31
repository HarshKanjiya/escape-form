"use client";

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle,
    Circle,
    ChevronLeft,
    ChevronRight,
    Link2,
    Code,
    FileText,
    Palette,
    Users,
    BarChart3,
    Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SpotlightCard } from '../ui/spotLightCard';

interface FormTemplate {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    isPro?: boolean;
    preview?: string;
}

const templates: FormTemplate[] = [
    {
        id: "contact",
        name: "Contact Form",
        description: "Simple contact form with name, email, and message fields",
        icon: <Users className="w-6 h-6" />,
        category: "Business",
        preview: "/logo-light.png"
    },
    {
        id: "feedback",
        name: "Feedback Form",
        description: "Collect user feedback with rating and comments",
        icon: <BarChart3 className="w-6 h-6" />,
        category: "Business",
        preview: "/logo-light.png"
    },
    {
        id: "survey",
        name: "Customer Survey",
        description: "Multi-step survey with various question types",
        icon: <FileText className="w-6 h-6" />,
        category: "Research",
        isPro: true,
        preview: "/logo-light.png"
    },
    {
        id: "registration",
        name: "Event Registration",
        description: "Event registration with participant details",
        icon: <Palette className="w-6 h-6" />,
        category: "Events",
        preview: "/logo-light.png"
    },
    {
        id: "newsletter",
        name: "Newsletter Signup",
        description: "Signup form for newsletters",
        icon: <FileText className="w-6 h-6" />,
        category: "Marketing",
        preview: "/logo-light.png"
    },
    {
        id: "job",
        name: "Job Application",
        description: "Form for job applications",
        icon: <Users className="w-6 h-6" />,
        category: "HR",
        preview: "/logo-light.png"
    },
    {
        id: "support",
        name: "Support Request",
        description: "Form for support requests",
        icon: <BarChart3 className="w-6 h-6" />,
        category: "Support",
        preview: "/logo-light.png"
    },
    {
        id: "order",
        name: "Order Form",
        description: "Product order form",
        icon: <Palette className="w-6 h-6" />,
        category: "Sales",
        preview: "/logo-light.png"
    },
    {
        id: "event",
        name: "Event RSVP",
        description: "RSVP for events",
        icon: <FileText className="w-6 h-6" />,
        category: "Events",
        preview: "/logo-light.png"
    },
    {
        id: "quiz",
        name: "Quiz",
        description: "Quiz form",
        icon: <BarChart3 className="w-6 h-6" />,
        category: "Education",
        preview: "/logo-light.png"
    },
    {
        id: "poll",
        name: "Poll",
        description: "Poll form",
        icon: <Users className="w-6 h-6" />,
        category: "Research",
        preview: "/logo-light.png"
    },
    {
        id: "feedback2",
        name: "Product Feedback",
        description: "Product feedback form",
        icon: <Palette className="w-6 h-6" />,
        category: "Business",
        preview: "/logo-light.png"
    }
];

interface FormData {
    type: 'reach-out' | 'embedded' | null;
    template: string | null;
}

interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

function Stepper({ currentStep, totalSteps }: StepperProps) {
    const stepLabels = ["Form Type", "Template"];

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div className="relative">
                {/* Progress bar background */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-muted-foreground/20" />

                {/* Progress bar fill */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-300 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                <div className="relative flex justify-between">
                    {Array.from({ length: totalSteps }, (_, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;

                        return (
                            <div key={stepNumber} className="flex flex-col items-center">
                                <div
                                    className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                                        isCompleted
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : isCurrent
                                                ? "border-primary text-primary bg-accent"
                                                : "border-muted-foreground/30 text-muted-foreground bg-background"
                                    )}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <span className="text-sm font-medium">{stepNumber}</span>
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

interface FormTypeStepProps {
    selectedType: string | null;
    onTypeSelect: (type: 'reach-out' | 'embedded') => void;
}

function FormTypeStep({ selectedType, onTypeSelect }: FormTypeStepProps) {
    return (
        <div className="space-y-6 mb-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Choose Form Type</h2>
                <p className="text-muted-foreground">
                    Select how you want to share your form with respondents
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
                <SpotlightCard className={cn(
                    "trainsition-transform duration-200 ease-out",
                    selectedType === 'reach-out'
                        ? "ring-2 ring-primary scale-105"
                        : "scale-100"
                )}>
                    <Card
                        className="group relative hover:shadow-md transition-all duration-200 cursor-pointer bg-secondary/50 backdrop-blur-2xl rounded-none h-full py-3"
                        onClick={() => onTypeSelect('reach-out')}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Reach Out Form</h3>
                                    <Badge variant="outline" className="text-xs">Standalone</Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Create a standalone form with its own URL that you can share via link,
                                email, or social media.
                            </p>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>One-click sharing via email & social</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Custom thank you pages</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Form scheduling (open/close dates)</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Response limits per form</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Brandable form URL (custom domain)</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </SpotlightCard>
                <SpotlightCard className={cn(
                    "trainsition-transform duration-200 ease-out",
                    selectedType === 'embedded'
                        ? "ring-2 ring-primary scale-105"
                        : "scale-100"
                )}>
                    <Card
                        className="group relative hover:shadow-md transition-all duration-200 cursor-pointer bg-secondary/50 backdrop-blur-2xl rounded-none h-full py-3"
                        onClick={() => onTypeSelect('embedded')}
                    >
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Embedded Form</h3>
                                    <Badge variant="outline" className="text-xs">Integrated</Badge>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                                Embed the form directly into your website or application.
                                Seamlessly integrates with your existing design.
                            </p>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Seamless website integration</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Auto-resize to container</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Pre-fill fields from URL params</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Custom event hooks (onSubmit, onError)</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>Theme sync with your site</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </SpotlightCard>
            </div>
        </div >
    );
}

interface TemplateStepProps {
    selectedTemplate: string | null;
    onTemplateSelect: (template: string) => void;
    onFromScratch: () => void;
}

function TemplateStep({ selectedTemplate, onTemplateSelect, onFromScratch }: TemplateStepProps) {
    return (
        <div className="flex flex-col md:flex-row gap-10 items-stretch w-full max-w-6xl mx-auto">
            {/* Left side: header and large button */}
            <div className="flex-[1.2] flex flex-col justify-center items-center bg-[#18181b] rounded-2xl p-12 border-2 border-zinc-800 shadow-xl min-h-[500px]">
                <h2 className="text-4xl font-bold mb-6 text-white text-center">Start from Scratch</h2>
                <p className="text-muted-foreground text-lg mb-10 text-center max-w-md">
                    Create a custom form from the ground up, tailored to your needs.
                </p>
                <Button
                    variant={selectedTemplate === 'scratch' ? "default" : "secondary"}
                    onClick={onFromScratch}
                >
                    <FileText className="w-7 h-7 mr-4" />
                    Start from Scratch
                </Button>
            </div>
            {/* Right side: templates */}
            <div className="flex-[1.5] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 content-start overflow-y-auto max-h-[520px] pr-2">
                {templates.map((template) => (
                    <div
                        key={template.id}
                        className={cn(
                            "relative bg-[#19191d] rounded-2xl border-2 flex flex-col items-center p-0 transition-all duration-200 group cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/80",
                            selectedTemplate === template.id
                                ? "border-primary ring-2 ring-primary"
                                : "border-zinc-800 hover:border-primary/60"
                        )}
                        style={{ minHeight: 180 }}
                        onClick={() => onTemplateSelect(template.id)}
                    >
                        {/* Selected overlay */}
                        {selectedTemplate === template.id && (
                            <div className="absolute inset-0 bg-primary/10 pointer-events-none z-10" />
                        )}
                        {/* Preview image placeholder */}
                        <div className="w-full h-32 flex items-center justify-center bg-zinc-900 border-b border-zinc-800 group-hover:border-primary/40 transition-all duration-200">
                            <img
                                src={template.preview || "/logo-light.png"}
                                alt={template.name}
                                className="object-contain w-full h-full transition-transform duration-200 group-hover:scale-105"
                            />
                        </div>
                        <div className="w-full px-3 py-2 flex items-center justify-center">
                            <h3 className="font-semibold text-xs text-white mb-0 text-center tracking-tight group-hover:text-primary transition-colors duration-200">
                                {template.name}
                            </h3>
                        </div>
                        {/* Border highlight for selected */}
                        {selectedTemplate === template.id && (
                            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded shadow z-20">Selected</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

interface DetailsStepProps {
    formData: FormData;
    onFormDataChange: (field: keyof FormData, value: string) => void;
}

export function FormCreationStepper() {
    const [currentStep, setCurrentStep] = useState(1);
    const [prevStep, setPrevStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        type: null,
        template: null
    });

    const totalSteps = 2;

    const handleFormDataChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setPrevStep(currentStep);
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setPrevStep(currentStep);
            setCurrentStep(currentStep - 1);
        }
    };

    const handleTypeSelect = (type: 'reach-out' | 'embedded') => {
        setFormData(prev => ({ ...prev, type }));
    };

    const handleTemplateSelect = (template: string) => {
        setFormData(prev => ({ ...prev, template }));
    };

    const handleFromScratch = () => {
        setFormData(prev => ({ ...prev, template: 'scratch' }));
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.type !== null;
            case 2:
                return formData.template !== null;
            default:
                return false;
        }
    };

    const handleSubmit = () => {
        console.log('Form data:', formData);
        // Here you would typically call an API to create the form
    };

    return (
        <div className="bg-background p-2 h-full relative pt-8">
            {/* SVG background behind all content */}
            <div className='absolute inset-0 pointer-events-none z-0 border rounded-2xl opacity-50'>
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1440 900"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <pattern id="lines135" patternUnits="userSpaceOnUse" width="34" height="34" patternTransform="rotate(135)">
                            <rect x="0" y="30" width="64" height="1" fill="#e5e7eb" opacity="0.05" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="1440" height="900" fill="url(#lines135)" />
                </svg>
            </div>
            <div className="relative z-10 max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-2">
                    <h1 className="text-2xl font-bold mb-1">Create a Form in 2 Steps</h1>
                    <p className="text-muted-foreground text-sm">
                        Build beautiful, responsive forms in minutes
                    </p>
                </div>

                <Stepper currentStep={currentStep} totalSteps={totalSteps} />

                {/* Animate height of step content container */}
                <motion.div layout className="flex flex-col gap-1">
                    <AnimatePresence initial={false} mode="wait">
                        {currentStep === 1 && (
                            <motion.div
                                key="step-1"
                                initial={{ x: prevStep < currentStep ? 100 : -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: prevStep < currentStep ? 100 : -100, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            >
                                <FormTypeStep
                                    selectedType={formData.type}
                                    onTypeSelect={handleTypeSelect}
                                />
                            </motion.div>
                        )}
                        {currentStep === 2 && (
                            <motion.div
                                key="step-2"
                                initial={{ x: prevStep < currentStep ? 100 : -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: prevStep < currentStep ? 100 : -100, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                            >
                                <TemplateStep
                                    selectedTemplate={formData.template}
                                    onTemplateSelect={handleTemplateSelect}
                                    onFromScratch={handleFromScratch}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-4 mt-2 border-t transition-all duration-300 ease-in-out">
                        <Button
                            variant="outline"
                            onClick={handlePrevious}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!canProceed()}
                            >
                                Create Form
                                <CheckCircle className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
