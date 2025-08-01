"use client";

import LeftBar from "@/components/formBuilder/leftBar";
import MainContent from "@/components/formBuilder/mainContent";
import RightBar from "@/components/formBuilder/rightBar";
import { useFormBuilder } from "@/hooks/useFormBuilder";

export default function Page() {

    const {
        questions,
        selectedQuestion,
        selectedQuestionId,
        formSettings,
        viewMode,
        workflowDirection,
        connections,
        setSelectedQuestionId,
        setViewMode,
        setWorkflowDirection,
        addQuestion,
        updateQuestion,
        deleteQuestion,
        moveQuestion,
        updateFormSettings,
        addConnection,
        removeConnection,
    } = useFormBuilder();

    const handlePreview = () => { };

    const handlePublish = () => { };



    return (
        <div className="flex items-center justify-center h-full w-full flex-1">

            <LeftBar
                formSettings={formSettings}
                onUpdateSettings={updateFormSettings}
            />

            <MainContent
                viewMode={viewMode}
                questions={questions}
                selectedQuestionId={selectedQuestionId}
                workflowDirection={workflowDirection}
                connections={connections}
                onViewModeChange={setViewMode}
                onSelectQuestion={setSelectedQuestionId}
                onAddQuestion={addQuestion}
                onUpdateQuestion={updateQuestion}
                onDeleteQuestion={deleteQuestion}
                onMoveQuestion={moveQuestion}
                onWorkflowDirectionChange={setWorkflowDirection}
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