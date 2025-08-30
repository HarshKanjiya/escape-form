"use client";

import { getFormById } from "@/actions/form";
import LeftBar from "@/components/formBuilder/leftBar";
import MainContent from "@/components/formBuilder/mainContent";
import RightBar from "@/components/formBuilder/rightBar";
import { useFormBuilder } from "@/store/useFormBuilder";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

    const { initForm, setIsLoading } = useFormBuilder();
    const params = useParams();

    useEffect(() => {
        getForm();
    }, [params?.formId]);

    const getForm = async () => {
        const formId = params.formId;
        if (!formId) return;

        try {
            setIsLoading(true);
            const response = await getFormById(params["formId"] as string);
            if (response.success && response.data) {
                initForm(response.data);
            } else {
                console.error('Error fetching form:', response.error);
            }
        } catch (error) {
            console.error('Error fetching form:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handlePreview = () => { };

    const handlePublish = () => { };

    const handleUpdateDataSource = () => {

    }

    return (
        <div className="flex items-center justify-center h-full w-full flex-1">
            <LeftBar />
            <MainContent />
            <RightBar />
        </div>
    );
}