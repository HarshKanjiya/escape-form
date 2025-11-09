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
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

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
                const response = await api.get<ActionResponse<Form>>(apiConstants.form.getFormById(formId));

                if (!response.data.success) {
                    showError(response.data.message || getErrorMessage("form"));
                    setIsLoading(false);
                    return;
                }
                if (response.data.data) initForm(response.data.data);
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