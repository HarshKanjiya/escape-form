"use client";

import FormBuilderSkeleton from "@/components/formBuilder/formBuilderSkeleton";
import LeftBar from "@/components/formBuilder/leftBar";
import MainContent from "@/components/formBuilder/mainContent";
import RightBar from "@/components/formBuilder/rightBar";
import { apiConstants } from "@/constants/api.constants";
import { getErrorMessage } from "@/constants/messages";
import { ERROR_ROUTES } from "@/constants/routes.constants";
import { Form } from "@/generated/prisma";
import api from "@/lib/axios";
import { isValidUUID, showError } from "@/lib/utils";
import { useFormBuilder } from "@/store/useFormBuilder";
import { ActionResponse } from "@/types/common";
import { Question } from "@/types/form";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";

type formWithQuestions = Form & {
    questions?: Question[]
}

export default function FormBuilderWrapper() {

    const { initForm, setIsLoading, isLoading } = useFormBuilder();
    const params = useParams();
    const formId = params.formId as string;

    useEffect(() => {
        if (!formId || !isValidUUID(formId)) {
            redirect(ERROR_ROUTES.NOT_FOUND)
        }
        const getForm = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<ActionResponse<formWithQuestions>>(apiConstants.form.getFormById(formId));

                const form = response.data.data;
                if (!response.data.success || !form) {
                    showError(response.data.message || getErrorMessage("form"));
                    setIsLoading(false);
                    return;
                }

                const questions = form?.questions || [];
                delete form.questions

                if (response.data.data) initForm(response.data.data, questions);
            } catch (error) {
                console.error('Error fetching form:', error);
                showError(getErrorMessage("form"));
            } finally {
                setIsLoading(false);
            }
        }
        getForm();
    }, []);

    if (isLoading) {
        return <FormBuilderSkeleton />;
    }

    return (
        <div className="flex items-center justify-center h-full w-full flex-1">
            <LeftBar />
            <MainContent />
            <RightBar />
        </div>
    );
}