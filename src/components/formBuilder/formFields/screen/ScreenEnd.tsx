"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  question: Question,
  index: number
}

export function ScreenEndField({ question, index }: IProps) {
  const updateQuestion = useFormBuilder((state) => state.updateQuestion);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempQuestion, setTempQuestion] = useState(question.title);
  const [tempDescription, setTempDescription] = useState(question.description || '');

  const questionInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditingQuestion && questionInputRef.current) {
      questionInputRef.current.focus();
      questionInputRef.current.select();
    }
  }, [isEditingQuestion]);

  useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  const handleQuestionSave = () => {
    if (tempQuestion.trim() !== question.title) {
      updateQuestion(question.id, { title: tempQuestion.trim() });
    }
    setIsEditingQuestion(false);
  };

  const handleDescriptionSave = () => {
    if (tempDescription !== (question.description || '')) {
      updateQuestion(question.id, { description: tempDescription });
    }
    setIsEditingDescription(false);
  };

  const handleQuestionCancel = () => {
    setTempQuestion(question.title);
    setIsEditingQuestion(false);
  };

  const handleDescriptionCancel = () => {
    setTempDescription(question.description || '');
    setIsEditingDescription(false);
  };

  return (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <div className="space-y-6 w-full bg-card/50 rounded-lg border border-border/50 p-8">
        <div className="space-y-3">
          {isEditingQuestion ? (
            <Input
              ref={questionInputRef}
              value={tempQuestion}
              onChange={(e) => setTempQuestion(e.target.value)}
              onBlur={handleQuestionSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleQuestionSave();
                } else if (e.key === 'Escape') {
                  handleQuestionCancel();
                }
              }}
              className="!py-6 !px-4 !text-3xl font-bold border-none text-center"
              placeholder="Enter your ending title..."
            />
          ) : (
            <div
              onClick={() => setIsEditingQuestion(true)}
              className={cn(
                "text-3xl font-bold cursor-text py-3 rounded-md transition-colors text-center",
                !question.title && "text-muted-foreground"
              )}
            >
              {question.title || "Click to add ending title..."}
            </div>
          )}
        </div>
        <div>
          {isEditingDescription ? (
            <Textarea
              ref={descriptionInputRef}
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              onBlur={handleDescriptionSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleDescriptionSave();
                } else if (e.key === 'Escape') {
                  handleDescriptionCancel();
                }
              }}
              className="text-muted-foreground border-dashed resize-none !px-4 !py-3 !text-lg text-center"
              placeholder="Add description (optional)..."
              rows={4}
            />
          ) : (
            <div
              onClick={() => setIsEditingDescription(true)}
              className={cn(
                "text-lg text-muted-foreground cursor-text py-2 rounded-md transition-colors text-center",
                !question.description && "italic opacity-70"
              )}
            >
              {question.description || "Description (optional)"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
