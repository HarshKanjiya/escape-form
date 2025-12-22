"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  question: Question;
  index: number;
}

export function RatingZeroToTenField({ question, index }: IProps) {
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

  // Generate rating options from 0 to 10
  const ratingOptions = Array.from({ length: 11 }, (_, i) => i);

  return (
    <div className="p-6 w-full max-w-3xl mx-auto flex items-baseline gap-3">
      <div className="p-1 rounded bg-accent flex items-center justify-center h-10 w-10">
        <span className="italic border-b border-dotted border-accent-foreground">{index + 1}</span>
      </div>
      <div className="space-y-4 w-full flex-1">
        <div className="space-y-2">
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
              className="!py-6 !px-4 !text-xl border-none"
              placeholder="Enter your question..."
            />
          ) : (
            <div
              onClick={() => setIsEditingQuestion(true)}
              className={cn(
                "text-2xl font-medium cursor-text py-2 rounded-md transition-colors",
                !question.title && "text-muted-foreground"
              )}
            >
              <span className="flex items-center gap-2">
                <span>{question.title || "Click to add question..."}</span>
                <AnimatePresence mode="wait">
                  {question.required && (
                    <motion.span
                      key="required-star"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      className="text-destructive"
                    >
                      *
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
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
              className="text-muted-foreground border-dashed resize-none !px-4 !py-3 !text-lg"
              placeholder="Add description (optional)..."
              rows={3}
            />
          ) : (
            <div
              onClick={() => setIsEditingDescription(true)}
              className={cn(
                "text-base text-muted-foreground cursor-text py-1 rounded-md transition-colors relative",
                !question.description && "italic opacity-70"
              )}
            >
              {question.description || "Description (optional)"}
            </div>
          )}
        </div>

        {/* Rating buttons from 0 to 10 */}
        <div className="mt-6">
          <div className="grid grid-cols-12 gap-3 max-w-2xl">
            {ratingOptions.map((value) => (
              <motion.div
                key={value}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, delay: value * 0.02 }}
                className="flex items-center justify-center py-3 px-4 rounded-md bg-muted/50 cursor-not-allowed opacity-60 hover:opacity-70 transition-opacity"
              >
                <span className="text-base font-medium">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
