'use client'

import { useFormBuilder } from "@/store/useFormBuilder";
import { AnimatePresence, motion } from "motion/react";
import { AddressFieldConfig } from "../formFields/config/address";
import { CheckboxFieldFieldConfig } from "../formFields/config/checkbox";
import { DateFieldConfig } from "../formFields/config/date";
// import { DropdownFieldConfig } from "../formFields/config/dropdown";
import { DetailConfig } from "../formFields/config/detail";
import { EmailFieldConfig } from "../formFields/config/email";
import { FileUploadFieldConfig } from "../formFields/config/file";
import { LongTextFieldConfig } from "../formFields/config/longText";
import { NumberFieldConfig } from "../formFields/config/number";
import { PhoneFieldConfig } from "../formFields/config/phone";
import { RadioFieldConfig } from "../formFields/config/radio";
import { ShortTextFieldConfig } from "../formFields/config/shortText";
import { StarRatingFieldConfig } from "../formFields/config/starRating";
import { WebsiteFieldConfig } from "../formFields/config/website";
import { QuestionType } from "@/generated/prisma";

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
            case QuestionType.TEXT_SHORT:
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

            case QuestionType.TEXT_LONG:
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

            case QuestionType.NUMBER:
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

            case QuestionType.DATE:
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

            case QuestionType.USER_DETAIL:
                return (
                    <motion.div
                        key={uniqueKey}
                        variants={fadeInVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={transition}
                    >
                        <DetailConfig />
                    </motion.div>
                );

            case QuestionType.FILE_ANY:
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

            case QuestionType.CHOICE_SINGLE:
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

            case QuestionType.CHOICE_CHECKBOX:
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

            // case QuestionType.dropdown:
            //     return (
            //         <motion.div
            //             key={uniqueKey}
            //             variants={fadeInVariants}
            //             initial="initial"
            //             animate="animate"
            //             exit="exit"
            //             transition={transition}
            //         >
            //             <DropdownFieldConfig />
            //         </motion.div>
            //     );

            case QuestionType.INFO_EMAIL:
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

            case QuestionType.INFO_PHONE:
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

            case QuestionType.USER_ADDRESS:
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

            case QuestionType.INFO_URL:
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

            case QuestionType.RATING_STAR:
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

            // case QuestionType.barChoiceRating:
            //     return (
            //         <motion.div
            //             key={uniqueKey}
            //             variants={fadeInVariants}
            //             initial="initial"
            //             animate="animate"
            //             exit="exit"
            //             transition={transition}
            //         >
            //             <BarChoiceRatingFieldConfig />
            //         </motion.div>
            // );

            // case QuestionType.imageChoiceRating:
            //     return (
            //         <motion.div
            //             key={uniqueKey}
            //             variants={fadeInVariants}
            //             initial="initial"
            //             animate="animate"
            //             exit="exit"
            //             transition={transition}
            //         >
            //             <ImageChoiceRatingFieldConfig />
            //         </motion.div>
            //     );

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
                        <h2 className="question-card__title">{selectedQuestion?.title}</h2>
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