"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiConstants } from "@/constants/api.constants";
import { FormType, Form as IForm } from "@prisma/client";
import api from "@/lib/axios";
import { cn, showSuccess } from "@/lib/utils";
import { ActionResponse } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Check, CheckCircle, ChevronLeft, ChevronRight, ExternalLink, FileText, Link2, Palette, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from 'react';
import { useForm, type UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { ROUTES } from "@/constants/routes.constants";
import { CustomCard, CustomCardContent, CustomCardFooter, CustomCardHeader, CustomCardTitle } from "../ui/custom-card";

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

// Form schema for validation
const formSchema = z.object({
    name: z.string().min(1, "Form name is required").min(3, "Form name must be at least 3 characters"),
    description: z.string().optional(),
    type: z.enum(FormType).nullable(),
    template: z.string().nullable(),
})

type FormValues = z.infer<typeof formSchema>

interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

function Stepper({ currentStep, totalSteps }: StepperProps) {
    const stepLabels = ["Details", "Template"];

    return (
        <div className="w-full max-w-xl mx-auto mb-8">
            <div className="relative max-w-[300px] mx-auto">
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
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <span className="text-sm font-medium">{stepNumber}</span>
                                    )}
                                </div>
                                <div className="mt-2 text-center">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {stepLabels[index]}
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

interface DetailsStepProps {
    form: UseFormReturn<FormValues>;
}

function DetailsStep({ form }: DetailsStepProps) {
    return (
        <div className="space-y-8 mb-6 max-w-2xl mx-auto">
            <CustomCard>
                <CustomCardHeader>
                    <div className="text-center space-y-3">
                        <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text">
                            Basic Form Details
                        </h2>
                    </div>
                </CustomCardHeader>
                <CustomCardContent className='flex flex-col w-full'>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-base font-medium flex items-center gap-2 required">
                                    Form Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="e.g. Customer Feedback Survey"
                                        className="text-lg h-12 transition-all duration-200 focus:border-primary focus:ring-primary/20 hover:border-gray-400"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel className="text-base font-medium flex items-center gap-2 w-full">
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Tell us what this form is for. This helps you organize your forms and provides context for respondents."
                                        rows={4}
                                        className="text-base resize-none transition-all duration-200 focus:border-primary focus:ring-primary/20 hover:border-gray-400 min-h-24"
                                    />
                                </FormControl>
                                <FormDescription className="mt-2">
                                    A good description helps respondents understand the purpose of your form.
                                </FormDescription>
                            </FormItem>
                        )}
                    />
                </CustomCardContent>
            </CustomCard>
        </div>
    );
}

interface TemplateStepProps {
    selectedTemplate: string | null;
    onTemplateSelect: (template: string) => void;
    onFromScratch: () => void;
}

function TemplateStep({ selectedTemplate, onTemplateSelect, onFromScratch }: TemplateStepProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    // Get unique categories
    const categories = ["All", ...Array.from(new Set(templates.map(t => t.category)))];

    // Filter templates based on search and category
    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8">
            <CustomCard>
                <CustomCardHeader>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                            Choose Your Starting Point
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Start with a professionally designed template or build from scratch. All templates are fully customizable.
                        </p>
                    </div>
                </CustomCardHeader>
                <CustomCardContent>
                    {/* Search and Filter Controls */}
                    {/* <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Input
                                placeholder="Search templates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            {categories.map((category) => (
                                <Button
                                    key={category}
                                    variant={selectedCategory === category ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setSelectedCategory(category)}
                                    className="text-xs"
                                >
                                    {category}
                                </Button>
                            ))}
                        </div>
                    </div> */}

                    <div className="grid w-full gap-8">
                        {/* Start from Scratch Card - Enhanced */}
                        <div className="lg:col-span-1">
                            <div className={cn(
                                "h-full transition-all duration-300 cursor-pointer group border-2 hover:shadow-xl rounded-xl",
                                selectedTemplate === 'scratch'
                                    ? "border-primary"
                                    : "border-border hover:border-primary/50"
                            )}
                                onClick={onFromScratch}>
                                <div className="p-6 h-full flex flex-col justify-center items-center text-center space-y-4">
                                    <div className={cn(
                                        "p-4 rounded-full transition-all duration-300",
                                        selectedTemplate === 'scratch'
                                            ? "text-primary-foreground"
                                            : ""
                                    )}>
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold">Start from Scratch</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Create a custom form from the ground up with complete creative control
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <Badge variant={selectedTemplate === 'scratch' ? "default" : "secondary"}>
                                            Blank Canvas
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Templates Grid */}
                        {/* <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2">
                                {filteredTemplates.map((template) => (
                                    <CustomCard
                                        key={template.id}
                                        className={cn(
                                            "group cursor-pointer transition-all duration-300 relative overflow-hidden py-0 rounded-xl",
                                            selectedTemplate === template.id
                                                ? "border-primary shadow-md"
                                                : "border-border hover:border-primary/50"
                                        )}
                                        onClick={() => onTemplateSelect(template.id)}>
                                        <CustomCardHeader>
                                            <CustomCardTitle>{template.name}</CustomCardTitle>
                                        </CustomCardHeader>
                                        <CustomCardContent>
                                            <div className="relative h-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                                                <div className="absolute inset-0 opacity-10">
                                                    {template.category === 'Business' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                                                    )}
                                                    {template.category === 'Research' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600"></div>
                                                    )}
                                                    {template.category === 'Events' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600"></div>
                                                    )}
                                                    {template.category === 'Marketing' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600"></div>
                                                    )}
                                                    {template.category === 'HR' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-600"></div>
                                                    )}
                                                    {template.category === 'Support' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600"></div>
                                                    )}
                                                    {template.category === 'Sales' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600"></div>
                                                    )}
                                                    {template.category === 'Education' && (
                                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600"></div>
                                                    )}
                                                </div>
                                                <div className="absolute top-3 left-3 w-16 h-1 bg-white/40 dark:bg-gray-400/40 rounded transition-all duration-300 group-hover:w-20"></div>
                                                <div className="absolute top-6 left-3 w-12 h-1 bg-white/30 dark:bg-gray-400/30 rounded transition-all duration-300 group-hover:w-16"></div>
                                                <div className="absolute bottom-3 left-3 right-3 h-6 bg-white/20 dark:bg-gray-400/20 rounded transition-all duration-300 group-hover:bg-white/30 dark:group-hover:bg-gray-400/30"></div>
                                                <div className="absolute bottom-11 left-3 right-8 h-3 bg-white/15 dark:bg-gray-400/15 rounded transition-all duration-300"></div>
                                            </div>
                                        </CustomCardContent>
                                        <CustomCardFooter>
                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                {template.description}
                                            </p>
                                        </CustomCardFooter>
                                    </CustomCard>
                                ))}
                            </div>

                            {filteredTemplates.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No templates found</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Try adjusting your search terms or category filter
                                    </p>
                                </div>
                            )}
                        </div> */}
                    </div>
                </CustomCardContent>
                <CustomCardFooter>

                    <div className="text-center text-sm text-muted-foreground w-full">
                        Tempaltes coming soon!
                        {/* {filteredTemplates.length > 0 && (
                            <p>
                                Showing {filteredTemplates.length} of {templates.length} templates
                                {selectedCategory !== "All" && ` in ${selectedCategory}`}
                            </p>
                        )} */}
                    </div>
                </CustomCardFooter>
            </CustomCard>
            {/* Header */}


            {/* Template count */}
        </div>
    );
}

export function FormCreationStepper() {
    const [currentStep, setCurrentStep] = useState(1);
    const [prevStep, setPrevStep] = useState(1);
    const [selectedType, setSelectedType] = useState<FormType | null>(FormType.REACH_OUT);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const { projectId } = useParams<{ projectId: string }>();
    const router = useRouter();
    const totalSteps = 2;

    // Initialize react-hook-form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            type: FormType.REACH_OUT,
            template: null,
        },
    });

    const handleNext = () => {
        if (currentStep === 1) {
            // Trigger validation for step 1
            form.trigger(["name", "description"]).then((isValid) => {
                if (isValid) {
                    setPrevStep(currentStep);
                    setCurrentStep(currentStep + 1);
                }
            });
        } else if (currentStep < totalSteps) {
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

    const handleTypeSelect = (type: FormType) => {
        setSelectedType(type);
        form.setValue('type', type);
    };

    const handleTemplateSelect = (template: string) => {
        setSelectedTemplate(template);
        form.setValue('template', template);
    };

    const handleFromScratch = () => {
        setSelectedTemplate('scratch');
        form.setValue('template', 'scratch');
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return form.watch("name")?.trim()?.length > 3;
            case 2:
                return selectedType !== null;
            case 3:
                return selectedTemplate !== null;
            default:
                return false;
        }
    };

    const handleSubmit = async (data: FormValues) => {
        const finalData = {
            projectId: projectId,
            name: data.name || "",
            description: data.description || "",
            type: selectedType || FormType.REACH_OUT,
        };
        try {
            const response = await api.post<ActionResponse<IForm>>(apiConstants.form.createForm(), finalData);
            const form = response.data?.data;
            if (!response.data?.success || !form) {
                toast.error(response.data?.message || "Failed to create form");
                return;
            }
            showSuccess("Form created successfully!");
            router.push(ROUTES.form.edit(form.teamId, form.projectId, form.id))

        }
        catch (err) {
            console.error("Error creating form:", err);
        }
    };

    const onFormSubmit = () => {
        const formData = form.getValues();
        handleSubmit({
            ...formData,
            type: selectedType,
            template: selectedTemplate,
        });
    };

    return (
        <Form {...form}>
            <div className=" p-2 h-full relative pt-8 ">
                <div className='fixed inset-0 pointer-events-none z-0 border rounded-2xl custom-bg opacity-20 h-full custom-bg-animation'>
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
                <div className="relative z-10 w-full mx-auto">
                    {/* Header */}
                    <div className="text-center mb-2 max-w-3xl mx-auto">
                        <h1 className="text-2xl font-medium mb-1">Create a Form in <span className="underline underline-offset-1 ">3 Steps</span></h1>
                        <p className="text-muted-foreground text-sm">
                            Build beautiful, responsive forms in minutes
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Stepper currentStep={currentStep} totalSteps={totalSteps} />
                    </div>

                    {/* Animate height of step content container */}
                    <motion.div layout className="flex flex-col gap-1">
                        <AnimatePresence initial={true} mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step-1"
                                    initial={{ x: (prevStep == currentStep && currentStep == 1) ? 0 : prevStep < currentStep ? 100 : -100, opacity: 0, y: (prevStep == currentStep && currentStep == 1) ? 20 : 0 }}
                                    animate={{ x: 0, opacity: 1, y: 0 }}
                                    exit={{ x: prevStep < currentStep ? 100 : -100, opacity: 0, y: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                                    className="max-w-3xl mx-auto w-full"
                                >
                                    <DetailsStep form={form} />
                                    <motion.div
                                        className="w-full max-w-2xl pb-4 flex justify-end gap-4 items-center pt-4 mt-2 border-t transition-all duration-300 ease-in-out mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <Button
                                            className="w-1/2 px-7 py-8 text-right justify-end"
                                            onClick={handleNext}
                                            disabled={!canProceed()}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step-3"
                                    initial={{ x: prevStep < currentStep ? 100 : -100, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: prevStep < currentStep ? 100 : -100, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 40 }}
                                    className="w-full max-w-5xl mx-auto"
                                >
                                    <TemplateStep
                                        selectedTemplate={selectedTemplate}
                                        onTemplateSelect={handleTemplateSelect}
                                        onFromScratch={handleFromScratch}
                                    />
                                    <motion.div
                                        className="w-full pb-4 flex justify-between gap-4 items-center pt-4 mt-2 border-t transition-all duration-300 ease-in-out mx-auto"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <Button
                                            variant={'outline'}
                                            className="flex-1 px-7 py-8 text-left justify-start"
                                            onClick={handlePrevious}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" />
                                            Previous
                                        </Button>
                                        <Button
                                            className="flex-1 px-7 py-8"
                                            onClick={onFormSubmit}
                                            disabled={!canProceed()}
                                        >
                                            Create Form
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </Form>
    );
}
