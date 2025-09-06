'use client'

import { eQuestionType } from "@/enums/form";
import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "framer-motion";
import { AddressFieldConfig } from "../formFields/config/address";
import { BarChoiceRatingFieldConfig } from "../formFields/config/barChoiceRating";
import { CheckboxFieldFieldConfig } from "../formFields/config/checkbox";
import { DateFieldConfig } from "../formFields/config/date";
import { DropdownFieldConfig } from "../formFields/config/dropdown";
import { EmailFieldConfig } from "../formFields/config/email";
import { FileUploadFieldConfig } from "../formFields/config/file";
import { ImageChoiceRatingFieldConfig } from "../formFields/config/imageChoiceRating";
import { LongTextFieldConfig } from "../formFields/config/longText";
import { NumberFieldConfig } from "../formFields/config/number";
import { PhoneFieldConfig } from "../formFields/config/phone";
import { RadioFieldConfig } from "../formFields/config/radio";
import { ShortTextFieldConfig } from "../formFields/config/shortText";
import { StarRatingFieldConfig } from "../formFields/config/starRating";
import { WebsiteFieldConfig } from "../formFields/config/website";

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
                        <ShortTextFieldConfig />
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
                        <LongTextFieldConfig />
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
                        <NumberFieldConfig />
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
                        <DateFieldConfig />
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
                        <FileUploadFieldConfig />
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
                        <RadioFieldConfig />
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
                        <CheckboxFieldFieldConfig />
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
                        <DropdownFieldConfig />
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
                        <EmailFieldConfig />
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
                        <PhoneFieldConfig />
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
                        <AddressFieldConfig />
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
                        <WebsiteFieldConfig />
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
                        <StarRatingFieldConfig />
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
                        <BarChoiceRatingFieldConfig />
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
                        <ImageChoiceRatingFieldConfig />
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
                            Question type &quot;{selectedQuestion?.type}&quot; is not yet supported.
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