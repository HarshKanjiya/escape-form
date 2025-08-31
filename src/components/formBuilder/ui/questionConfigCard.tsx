'use client'

import { eQuestionType } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { LongTextConfig } from "../formFields/config/longText";
import { ShortTextConfig } from "../formFields/config/shortText";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestionConfigCard() {
    const { selectedQuestion } = useFormBuilder();

    const fadeInVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const transition = {
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1] as const
    };

    const renderComponent = () => {
        const uniqueKey = `${selectedQuestion?.type}-${selectedQuestion?.id}`;

        switch (selectedQuestion?.type) {
            case eQuestionType.shortText:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        <ShortTextConfig />
                    </motion.div>
                );

            case eQuestionType.longText:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        <LongTextConfig />
                    </motion.div>
                );

            case eQuestionType.number:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Number config component will go here */}
                        <div className="p-4">Number configuration</div>
                    </motion.div>
                );

            case eQuestionType.date:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Date config component will go here */}
                        <div className="p-4">Date configuration</div>
                    </motion.div>
                );

            case eQuestionType.file:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* File config component will go here */}
                        <div className="p-4">File configuration</div>
                    </motion.div>
                );

            case eQuestionType.radio:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Radio config component will go here */}
                        <div className="p-4">Radio configuration</div>
                    </motion.div>
                );

            case eQuestionType.checkbox:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Checkbox config component will go here */}
                        <div className="p-4">Checkbox configuration</div>
                    </motion.div>
                );

            case eQuestionType.dropdown:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Dropdown config component will go here */}
                        <div className="p-4">Dropdown configuration</div>
                    </motion.div>
                );

            case eQuestionType.email:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Email config component will go here */}
                        <div className="p-4">Email configuration</div>
                    </motion.div>
                );

            case eQuestionType.phone:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Phone config component will go here */}
                        <div className="p-4">Phone configuration</div>
                    </motion.div>
                );

            case eQuestionType.address:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Address config component will go here */}
                        <div className="p-4">Address configuration</div>
                    </motion.div>
                );

            case eQuestionType.website:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Website config component will go here */}
                        <div className="p-4">Website configuration</div>
                    </motion.div>
                );

            case eQuestionType.starRating:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Star rating config component will go here */}
                        <div className="p-4">Star rating configuration</div>
                    </motion.div>
                );

            case eQuestionType.barChoiceRating:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Bar choice rating config component will go here */}
                        <div className="p-4">Bar choice rating configuration</div>
                    </motion.div>
                );

            case eQuestionType.imageChoiceRating:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        {/* Image choice rating config component will go here */}
                        <div className="p-4">Image choice rating configuration</div>
                    </motion.div>
                );

            default:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                        className="p-4 border border-dashed border-muted-foreground/25 rounded-lg text-center"
                    >
                        <h2 className="question-card__title">{selectedQuestion?.question}</h2>
                        <p className="question-card__description">{selectedQuestion?.description}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Question type "{selectedQuestion?.type}" is not yet supported.
                        </p>
                    </motion.div>
                );
        }
    };

    return (
        <AnimatePresence mode="wait">
            {renderComponent()}
        </AnimatePresence>
    );
};