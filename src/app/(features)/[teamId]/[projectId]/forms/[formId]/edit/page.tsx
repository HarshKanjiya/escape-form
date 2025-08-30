"use client";

import { getFormById } from "@/actions/form";
import LeftBar from "@/components/formBuilder/leftBar";
import MainContent from "@/components/formBuilder/mainContent";
import RightBar from "@/components/formBuilder/rightBar";
import { useFormBuilder } from "@/hooks/useFormBuilder";
import { Form } from "@/types/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {

    const [formDb, setFormDb] = useState<Form | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();

    const {
        questions,
        selectedQuestion,
        selectedQuestionId,
        viewMode,
        connections,
        dataSource,
        setDataSource,
        setSelectedQuestionId,
        setViewMode,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        moveQuestion,
        addConnection,
        removeConnection,
    } = useFormBuilder();

    const getForm = async () => {
        const formId = params.formId;
        if (!formId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const response = await getFormById(params["formId"] as string);
            if (response.success && response.data) {
                setFormDb(response.data);
                setDataSource(response.data);
            } else {
                console.error('Error fetching form:', response.error);
            }
        } catch (error) {
            console.error('Error fetching form:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getForm();
    }, [params.formId]);

    const handlePreview = () => { };

    const handlePublish = () => { };

    const handleUpdateDataSource = () => {

    }

    return (
        <div className="flex items-center justify-center h-full w-full flex-1">

            <LeftBar
                selectedQuestionId={selectedQuestionId}
                questions={questions}
                dataSource={dataSource}
                pageLoading={isLoading}
                onUpdateDataSource={handleUpdateDataSource}
                onSetSelectedQuestionId={setSelectedQuestionId}
            />

            <MainContent
                viewMode={viewMode}
                questions={questions}
                selectedQuestionId={selectedQuestionId}
                selectedQuestion={selectedQuestion}
                connections={connections}
                onViewModeChange={setViewMode}
                onSelectQuestion={setSelectedQuestionId}
                onAddQuestion={addQuestion}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
                onMoveQuestion={moveQuestion}
                onAddConnection={addConnection}
                onRemoveConnection={removeConnection}
            />

            <RightBar
                selectedQuestion={selectedQuestion}
                onUpdateQuestion={updateQuestion}
                onPublish={handlePublish}
                onPreview={handlePreview}
            />
        </div>
    );
}