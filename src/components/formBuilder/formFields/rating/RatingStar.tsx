"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { Question } from "@/types/form";
import { AnimatePresence, motion } from "motion/react";
import { Info, StarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface IProps {
  question: Question,
  index: number
}

export function RatingStarField({ question, index }: IProps) {

  const updateQuestion = useFormBuilder((state) => state.updateQuestion);
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempQuestion, setTempQuestion] = useState(question.title);
  const [tempDescription, setTempDescription] = useState(question.description || '');
  const [mockCount, setMockCount] = useState<number[]>([]);

  const questionInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  const STAR_ANIMATE = { scale: 1, opacity: 1 };
  const STAR_EXIT = { scale: 0, opacity: 0 };

  const prevLengthRef = useRef<number>(0);
  const isAdding = mockCount.length > prevLengthRef.current;
  useEffect(() => {
    prevLengthRef.current = mockCount.length;
  }, [mockCount.length]);

  // Mock star rating
  useEffect(() => {
    const count = question.metadata?.starCount || 5;
    setMockCount(Array.from({ length: count }, (_, i) => i + 1));
  }, [question.metadata?.starCount]);

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
        <div className="flex items-center gap-2 text-lg text-primary-500/70">
          <AnimatePresence initial={false}>
            {mockCount.map((value, i) => (
              <motion.div
                key={value}
                initial={isAdding ? { scale: 0, opacity: 0, y: 0 } : false}
                animate={STAR_ANIMATE}
                exit={STAR_EXIT}
                transition={{ duration: 0.25, delay: isAdding ? i * 0.05 : 0 }}
                layout
              >
                <StarIcon />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div >
  );
}