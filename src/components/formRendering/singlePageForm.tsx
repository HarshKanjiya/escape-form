"use client";

import { eQuestionType } from "@/enums/form";
import { IQuestion } from "@/types/form";
import { useState } from "react";
import ShortQuestion from "./fields/shortQuestion";

interface Props {
    questions?: IQuestion[];
}

export default function RenderSinglePageForm({ questions }: Props) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleFieldChange = (questionId: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [questionId]: value
        }));

        // Clear error when user starts typing
        if (errors[questionId]) {
            setErrors(prev => ({
                ...prev,
                [questionId]: ""
            }));
        }
    };

    const renderField = (question: IQuestion) => {
        switch (question.type) {
            case eQuestionType.shortText:
                return (
                    <ShortQuestion
                        key={question.id}
                        question={question}
                        value={formData[question.id] || ""}
                        onChange={(value) => handleFieldChange(question.id, value)}
                        error={errors[question.id]}
                        className="mb-6"
                    />
                );
            // Add other field types here as needed
            default:
                return (
                    <div key={question.id} className="mb-6 p-4 border border-dashed border-gray-300 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                            Field type "{question.type}" not yet implemented
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Question: {question.question}
                        </p>
                    </div>
                );
        }
    };

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
        <div className="p-6 h-full w-full">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Form Preview</h1>
                    <p className="text-muted-foreground">
                        This is how your form will appear to users
                    </p>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {questions.map(renderField)}

                    {questions.length > 0 && (
                        <div className="pt-6 border-t">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                            >
                                Submit Form
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}